import {UserRepository} from "../repositories/user.repository";
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";

export class UserService {

    constructor(protected userRepo: UserRepository) {

    }

    async register(userData: { username: string, password: string, email: string }) {
        const userByUsername = await this.userRepo.findByUsername(userData.username);
        if (userByUsername) {
            throw new Error('Username already exists');
        }

        const userByEmail = await this.userRepo.findByEmail(userData.email);
        if (userByEmail) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = await this.userRepo.createUser({
            ...userData,
            password: hashedPassword,
        });

        return newUser;
    }

    async login(userData: { username: string, password: string }) {
        const userDetails = await this.userRepo.findByUsername(userData.username);
        if (!userDetails) {
            throw new Error('User not found');
        }

        const comparePassword = await bcrypt.compare(userData.password, userDetails.password);
        if (!comparePassword) {
            throw new Error('passwords or username do not match');
        }

        const accessToken = this.generateAccessToken({userId: userDetails.id});
        const refreshToken = this.generateRefreshToken({userId: userDetails.id});


        await this.userRepo.createUserAuth(refreshToken, userDetails.id);

        return {
            accessToken,
            refreshToken,
            userId: userDetails.id,
        };

    }

    async refreshToken(refreshToken: string) {
        let payload: { userId: string };

        try {
            payload = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string
            ) as { userId: string };
        } catch {
            throw new Error("Refresh token is invalid or expired");
        }

        const userAuth = await this.userRepo.findAuthByToken(refreshToken);

        if (!userAuth) throw new Error("No active user auth found");

        return this.generateAccessToken({userId: payload.userId});
    }

    private generateAccessToken(payload: { userId: string }) {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
            expiresIn: "15m",
        });
    }

    private generateRefreshToken(payload: { userId: string; }) {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
            expiresIn: "7d",
        });
    }

}