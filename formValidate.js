
function Validator(options) {

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};


    function validate(inputElement, rule) {
        var errorMessage;

        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
        // console.log(rule.selector)
        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector]

        console.log(rules)

        //Lặp qua từng rule và kiểm tra 
        //Nếu có lỗi thì dừng kiểm tra
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value)
            // console.log(errorMessage)
            if (errorMessage) break
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        }
        else {
            errorElement.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
        // console.log(inputElement.parentElement)
        return !errorMessage;
    }

    var formElement = document.querySelector(options.form)
    if (formElement) {

        formElement.onsubmit = (e) => {
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false;
                }
            });


            // console.log(enableInputs)
            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        values[input.name] = input.value;
                        return values
                    }, {})
                    options.onSubmit(formValues);
                }
                else {
                    formElement.submit();
                }
            }

            //Lặp qua rule và xử lí(lắng nghe sự kiện , input ...)
            options.rules.forEach(rule => {
                if (Array.isArray(selectorRules[rule.selector])) {
                    selectorRules[rule.selector].push(rule.test)
                }
                else {
                    selectorRules[rule.selector] = [rule.test]
                }
                // selectorRule[rule.selector] = rule.test
                var inputElement = document.querySelector(rule.selector)

                // console.log(errorElement)
                if (inputElement) {
                    inputElement.onblur = function () {
                        validate(inputElement, rule)
                    }

                    inputElement.oninput = function () {
                        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                        errorElement.innerText = ''
                        getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                    }
                }
            });
            // console.log(selectorRule)
        }
    }

}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email'
        }
    }
}

Validator.minLength = (selector, min) => {
    return {
        selector: selector,
        test: (value) => {
            return value.length >= min ? undefined : `Vui lòng nhập vào tối thiểu ${min} kí tự`
        }
    }
}

Validator.isConfirmed = (selector, getConfirmValue, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập không chính xác'
        }
    }
}
