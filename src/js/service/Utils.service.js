
export const errorMessage = (errorMessage, errorMessageContainer) => {
    errorMessageContainer.text('');
    errorMessageContainer.text(errorMessage);
    errorMessageContainer.css('display', 'block');
}