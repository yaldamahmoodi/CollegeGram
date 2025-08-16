import {UserRepository} from "../repositories/user.repository";
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";


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

        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

        const sessionId = crypto.randomUUID();

        const accessToken = jwt.sign({
            id: userDetails.id,
            username: userDetails.username,
        }, accessTokenSecret, {expiresIn: '15m'});

        const refreshToken = jwt.sign({
            id: userDetails.id,
            username: userDetails.username,
            sessionId: sessionId,
        }, refreshTokenSecret, {expiresIn: '7d'});

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.userRepo.createUserSession(
            sessionId,
            hashedRefreshToken,
            userDetails.id,
        );

        return {
            accessToken,
            refreshToken,
            sessionId,
            userId: userDetails.id,
        };
    }

    async refreshToken(sessionId: string, refreshToken: string) {
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as {
                sessionId: string,
                userId: string
            };
        } catch (err) {
            throw new Error('Refresh token is invalid or expired');
        }

        const userSession = await this.userRepo.findSessionById(sessionId);
        if (!userSession) {
            throw new Error('User session not found');
        }
        if (payload.sessionId !== sessionId) {
            throw new Error('Session mismatch');
        }

        if (userSession.status !== 'active') {
            throw new Error('Session is no longer active');
        }

        const isValid = await bcrypt.compare(refreshToken, userSession.refreshTokenHash);
        if (!isValid) {
            throw new Error('Refresh token is not valid');
        }

        const newAccessToken = jwt.sign(
            {userId: userSession.userId},
            process.env.ACCESS_TOKEN_SECRET as string,
            {expiresIn: '15m'}
        );

        return newAccessToken;
    }

}