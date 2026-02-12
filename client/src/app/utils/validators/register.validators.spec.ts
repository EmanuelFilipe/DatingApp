import { ValidateRequiredFields } from './register.validators'
import { RegisterCreds } from '../../../types/register-creds'

describe('ValidateRequiredFields', () => {
    it('should return error when required fields are empty', () => {
        const creds = {
            email: '',
            displayName: '',
            password: ''
        } as RegisterCreds 

        const result = ValidateRequiredFields(creds)

        expect(result).toBe('All fields are required!')
    })
})