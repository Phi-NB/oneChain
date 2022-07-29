const checkLengthRequire = (min, max, title) => {
    return {
        validator(rule, value = "") {
            if (value.length >= max || value.length <= min) {
                return Promise.reject(`${title} length ${min}-${max}`);
            } else if (value.length === 0) {
                return Promise.reject("Require");
            } else {
                return Promise.resolve();
            }
        }
    };
};

export const checkEmail = () => {
    return [
        {
            type: "email",
            message: "The input is not valid E-mail!"
        },
        {
            required: true,
            message: "Please input your E-mail!"
        }
    ];
};

export const checkChooseRadio = () => {
    return [
        {
            required: true,
            message: "Please select an option!"
        }
    ];
};

export default checkLengthRequire;
