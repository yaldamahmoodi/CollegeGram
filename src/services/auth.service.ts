import {AuthRepository} from "../repositories/auth.repository.ts";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import env from "../../env.ts";
import type {insertUserZodSchema} from "../db/models/user.model.ts";


export class AuthService {

    private readonly authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }


    async register(user: insertUserZodSchema) {
        try {
            const userByEmail = await this.authRepository.findByEmail(user.email);
            if (userByEmail) {
                throw new Error('Email already exists');
            }
            const hashedPassword = await bcrypt.hash(user.password, 10);

            return await this.authRepository.createUser({
                ...user,
                password: hashedPassword,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
            throw new Error(
                'Internal server error'
            )
        }

    }

    async login(userData: insertUserZodSchema) {
        const {_id, password, username, email} = await this.authRepository.findByUsername(userData.username);

        if (!_id) {
            throw new Error('User not found');
        }

        const comparePassword = bcrypt.compare(userData.password, password);
        if (!comparePassword) {
            throw new Error('passwords or username do not match');
        }

        const accessToken = jwt.sign({
                _id,
                username,
                email,
            }, env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: env.ACCESS_TOKEN_EXPIRES_IN
            });

        return {
            accessToken,
            _id
        };
    }


    async logout() {

    }

}