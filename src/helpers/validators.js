/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const {
    __,
    all,
    allPass,
    any,
    complement,
    compose,
    countBy,
    equals,
    filter,
    gte,
    identity,
    length,
    not,
    propEq,
    values,
} = require('ramda');

const isWhite = equals('white');
const isRed = equals('red');
const isOrange = equals('orange');
const isGreen = equals('green');
const isBlue = equals('blue');

const isNotWhite = complement(equals('white'));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, triangle, circle }) => {
    return allPass([
        propEq('star', 'red'),
        propEq('square', 'green'),
        propEq('triangle', 'white'),
        propEq('circle', 'white'),
    ])({ star, square, triangle, circle });
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (figures) => {
    const findGreenFigs = compose(length, filter(isGreen), values);
    return gte(findGreenFigs(figures), 2);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) => {
    const findRedFigs = compose(length, filter(isRed), values);
    const findBlueFigs = compose(length, filter(isBlue), values);
    return equals(findRedFigs(figures), findBlueFigs(figures));
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({ star, square, triangle, circle }) => {
    return isBlue(circle) && isRed(star) && isOrange(square);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (figures) => {
    const colorCounts = countBy(identity, filter(isNotWhite, values(figures))); // подсчет фигур каждого цвета
    return any(gte(__, 3))(values(colorCounts));
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = ({ star, square, triangle, circle }) => {
    const findGreenFigs = compose(length, filter(isGreen), values);
    const findRedFigs = compose(length, filter(isRed), values);
    return (
        equals(findGreenFigs({ star, square, triangle, circle }), 2) &&
        equals(findRedFigs({ star, square, triangle, circle }), 1) &&
        isGreen(triangle)
    );
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figures) => all(isOrange)(Object.values(figures));

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({ star, square, triangle, circle }) => {
    return !isRed(star) && !isWhite(star);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (figures) => all(isGreen)(Object.values(figures));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ star, square, triangle, circle }) => {
    return equals(triangle, square) && not(isWhite(triangle)) && not(isWhite(square));
};
