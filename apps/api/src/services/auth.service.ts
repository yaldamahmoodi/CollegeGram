import {AuthRepository} from "../repositories/auth.repository.ts";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import env from "../../env.ts";
import type {insertUserZodSchema, selectUserZodSchema} from "../db/models/user.model.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import {ElasticClient} from "./elasticClient.service.ts";
import {UserSearchService} from "./UserSearchService.ts";

const elasticClient = new ElasticClient();
const userSearchService = new UserSearchService(elasticClient);

export class AuthService {

    private readonly authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }


    async register(user: insertUserZodSchema) {

        const userByEmail = await this.authRepository.findByEmail(user.email);
        const userByUsername = await this.authRepository.findByUsername(user.username);

        if (userByEmail || userByUsername) {
            throw new ValidationError("DUPLICATE_CREDENTIALS");
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await this.authRepository.createUser({
            ...user,
            password: hashedPassword,
        });

        if(newUser) {

            try {
                await userSearchService.indexUser(newUser);
            } catch (err) {
                console.error(`Failed to index new user ${newUser._id} in ES:`, err);
            }
        }

        return newUser;
    }

    async login(inputUsername: string, inputPassword: string) {

        const user = await this.authRepository.findByUsername(inputUsername);

        if (!user) {
            throw new NotFoundError("NOT_FOUND_USER");
        }

        const {_id, password, username, email} = user;

        const comparePassword = await bcrypt.compare(inputPassword, password);
        if (!comparePassword) {
            throw new ValidationError("INVALID_CREDENTIALS");
        }
        const accessToken = jwt.sign({
                _id,
                username,
                email,
            }, env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: env.ACCESS_TOKEN_EXPIRES_IN
            });

        return {accessToken, userId: _id};
    }


    async logout() {

    }

}