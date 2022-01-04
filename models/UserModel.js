class User { // model imported in userController

    userId;
    profileImgUrl;
    lastName;
    firstName;
    email;
    password;
    adress;
    isCompany;
    companyNumber;
    subscriptionExpirationDate;
    birthDate;
    bankNumber;
    actualWallet = 0.0;


    constructor(userId, profileImgUrl, lastName, firstName, isCompany, email, password, adress, birthDate, companyNumber, subscriptionExpirationDate, bankNumber, actualWallet) {
        this.userId = userId;
        this.profileImgUrl = profileImgUrl;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.isCompany = isCompany
        this.adress = adress; //Only If User is COMPANY
        this.companyNumber = companyNumber; //Only If User is COMPANY
        this.subscriptionExpirationDate = subscriptionExpirationDate;
        this.birthDate = birthDate; //Only If User is VIEWER
        this.bankNumber = bankNumber; //Only If User is VIEWER
        this.actualWallet = actualWallet; //Only If User is VIEWER
    }
};

module.exports = User;