import {AuthRepository} from "../repositories/auth.repository.ts";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import env from "../../env.ts";
import type {insertUserZodSchema, selectUserZodSchema} from "../db/models/user.model.ts";


export class AuthService {

    private readonly authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }


    async register(user: insertUserZodSchema) {
        try {
            const userByEmail = await this.authRepository.findByEmail(user.email);
            const userByUsername = await this.authRepository.findByUsername(user.username);
            // I dont know how to resolve this warning , wil check with amin
            if (userByEmail || userByUsername) {
                throw new Error('Email or username already exists');
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
        const user = await this.authRepository.findByUsername(userData.username);

        if (!user) {
            throw new Error('User not found');
        }

        const {_id, password, username, email} = await this.authRepository.findByUsername(userData.username);

        if (!_id) {
            throw new Error('User not found');
        }

        const comparePassword = await bcrypt.compare(userData.password, password);
        if (!comparePassword) {
            throw new Error('passwords or username do not match');
        }

        return jwt.sign({
                _id,
                username,
                email,
            }, env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: env.ACCESS_TOKEN_EXPIRES_IN
            });


    }


    async logout() {

    }

}