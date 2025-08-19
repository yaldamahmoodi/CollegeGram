import {authRepository} from "../repositories/auth.repository.ts";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import env from "../../env.js";
import type {insertUserZodSchema} from "../db/models/user.model.js";


export class authService {

    private readonly authRepo = authRepository;


    async register(userData: { username: string, password: string, email: string }) {
        const userByUsername = await this.authRepo.findByUsername(userData.username);
        if (userByUsername) {
            throw new Error('Username already exists');
        }

        const userByEmail = await this.authRepo.findByEmail(userData.email);
        if (userByEmail) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        return await this.authRepo.createUser({
            ...userData,
            password: hashedPassword,
        });


    }

    async login(userData: insertUserZodSchema) {
        const {_id, password, username, email} = await this.authRepo.findByUsername(userData.username);
        if (_id) {
            throw new Error('User not found');
        }

        const comparePassword = await bcrypt.compare(userData.password, password);
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
}