import Joi from "joi";
import { JoiAuthBearer } from "../middlewares/validator";

export default {
    auth: Joi.object()
        .keys({
            authorization: JoiAuthBearer().required(),
        })
        .unknown(true),
};
