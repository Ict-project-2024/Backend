export const CreateSuccess = (statusCode, succesMessage, data) => {
    const successObj = {
        status: statusCode,
        message: succesMessage,
        data: data
    }
    return successObj;
}