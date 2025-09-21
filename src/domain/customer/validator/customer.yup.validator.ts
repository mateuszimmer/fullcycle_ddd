import { ValidatorInterface } from "../../@shared/validator/validator.interface";
import { Customer } from "../entity/customer";
import * as yup from 'yup';

export default class CustomerYupValidator implements ValidatorInterface<Customer> {
    validate(entity: Customer): void {
        try {
            yup.object().shape({
                id: yup.string().required(),
                name: yup.string().required(),
            })
            .validateSync({
                id: entity.getId(),
                name: entity.name
            }, {
                abortEarly: false,
            })
        } catch (e) {
            const errors = e as yup.ValidationError;
            errors.errors.forEach((error) => {
                entity.notification.addError({
                    context: 'customer',
                    message: error,
                })
            })
        }
    }
}