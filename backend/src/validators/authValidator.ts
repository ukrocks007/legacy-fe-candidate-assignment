import { body } from 'express-validator';

/**
 * Validation rules for getting authentication nonce
 */
export const getNonceValidation = [
  body('walletAddress')
    .notEmpty()
    .withMessage('Wallet address is required')
    .isLength({ min: 42, max: 42 })
    .withMessage('Wallet address must be 42 characters long')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid Ethereum wallet address format'),
];

/**
 * Validation rules for authentication login
 */
export const loginValidation = [
  body('walletAddress')
    .notEmpty()
    .withMessage('Wallet address is required')
    .isLength({ min: 42, max: 42 })
    .withMessage('Wallet address must be 42 characters long')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid Ethereum wallet address format'),

  body('signature')
    .notEmpty()
    .withMessage('Signature is required')
    .isLength({ min: 132, max: 132 })
    .withMessage('Signature must be 132 characters long')
    .matches(/^0x[a-fA-F0-9]{130}$/)
    .withMessage('Invalid signature format'),

  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
];
