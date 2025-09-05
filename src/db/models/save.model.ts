import mongoose, {type Model, Schema, Types} from "mongoose";
import {z} from "zod";


export interface ISave {
    _id: Types.ObjectId,
    post_id: Types.ObjectId,
    user_id: Types.ObjectId, // saved user id
    createdAt: Date,
}

const SaveSchema: Schema<ISave> = new Schema<ISave>({
        user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
        post_id: {type: Schema.Types.ObjectId, ref: "Post", required: true},
    },
    {
        timestamps: {createdAt: 'createdAt'}
    })

// تا جلوی رکورد تکراری رو بگیریم
SaveSchema.index({user_id: 1, post_id: 1}, {unique: true});

export const SaveModel: Model<ISave> = mongoose.model<ISave>('Saves', SaveSchema);


export const insertSavePostZodSchema = z.object({
    post_id: Types.ObjectId,
    user_id: Types.ObjectId,
})

export type savePostDTO = z.infer<typeof insertSavePostZodSchema>;