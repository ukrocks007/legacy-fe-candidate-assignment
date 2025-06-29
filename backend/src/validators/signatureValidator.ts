import { body, ValidationChain } from 'express-validator';

export const verifySignatureValidation: ValidationChain[] = [
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),

  body('signature')
    .notEmpty()
    .withMessage('Signature is required')
    .isString()
    .withMessage('Signature must be a string')
    .matches(/^0x[a-fA-F0-9]{130}$/)
    .withMessage(
      'Signature must be a valid hex string of 130 characters starting with 0x'
    ),
];
