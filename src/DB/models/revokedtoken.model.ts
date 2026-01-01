import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateAggregationStage, UpdateQuery } from 'mongoose';


@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class RevokedToken {
@Prop({ type: Types.ObjectId, ref: 'User', required: true })
 userId : Types.ObjectId



@Prop({ type: String, required: true })
tokenId : string


@Prop({ type: Date, required: true })
expiredAt : Date

}
export type HRevokedTokenDocument = HydratedDocument<RevokedToken>;

const RevokedTokenSchema = SchemaFactory.createForClass(RevokedToken);

export const RevokedTokenModel = MongooseModule.forFeature([
  { name: RevokedToken.name, schema: RevokedTokenSchema },
]);
