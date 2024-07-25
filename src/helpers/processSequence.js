/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
    allPass,
    andThen,
    compose,
    curry,
    gt,
    ifElse,
    length,
    lt,
    otherwise,
    pipe,
    prop,
    tap,
    test,
} from 'ramda';

const api = new Api();

const longerThanTwo = compose(lt(2), length);
const shorterThanTen = compose(gt(10), length);
const isNumber = test(/^\d+(\.\d+)?$/);

const isValid = allPass([longerThanTwo, shorterThanTen, isNumber]);

const strToNumber = compose(Math.round, Number);
const numToStr = String;
const getStrLength = length;
const squaring = (num) => Math.pow(num, 2);
const getRemainOfDivision = curry((div, num) => num % div);
const getResult = prop('result');

/**
 *
 * @param {Object} object
 * @param {string} object.value
 * @param {Function} object.writeLog
 * @param {Function} object.handleSuccess
 * @param {Function} object.handleError
 *
 */
const processSequence = ({
    value,
    writeLog,
    handleSuccess,
    handleError,
}) => {
    const logCurrentValue = tap(writeLog);

    const handleApiRejection = (error) => {
        handleError('rejected response');
        return Promise.reject(error);
    };

    const handleAnimalResponse = pipe(getResult, handleSuccess);

    const requestToAnimal = pipe(
        getRemainOfDivision(3),
        logCurrentValue,
        (id) => api.get(`https://animals.tech/${id}`, {})
    );

    const handleNumberResponse = pipe(
        getResult,
        logCurrentValue,
        numToStr,
        getStrLength,
        logCurrentValue,
        squaring,
        logCurrentValue,
        requestToAnimal,
        andThen(handleAnimalResponse),
        otherwise(handleApiRejection)
    );

    const runNumberConvert = pipe(strToNumber, logCurrentValue, (num) =>
        api
            .get('https://api.tech/numbers/base', {
                number: num,
                from: 10,
                to: 2,
        }),
        andThen(handleNumberResponse),
        otherwise(handleApiRejection)
    );

    const validateAndRun = ifElse(
        isValid,
        pipe(logCurrentValue, runNumberConvert),
        () => handleError('ValidationError'),
    );

    validateAndRun(value);
};

export default processSequence;
