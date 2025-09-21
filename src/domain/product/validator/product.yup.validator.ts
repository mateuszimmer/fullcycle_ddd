import { ValidatorInterface } from "../../@shared/validator/validator.interface";
import { Product } from "../entity/product";
import * as yup from 'yup';

export class ProductYupValidator implements ValidatorInterface<Product> {
    validate(entity: Product): void {
        try {
            yup.object().shape({
                id: yup.string().required(),
                name: yup.string().required(),
                price: yup.number().required().positive(),
            })
            .validateSync({
                id: entity.getId(),
                name: entity.name,
                price: entity.price
            }, {
                abortEarly: false
            });
        } catch (e) {
            const error = e as yup.ValidationError;
            error.errors.forEach(error => {
                entity.notification.addError({
                    context: 'product',
                    message: error
                });
            });
        }
    }
}