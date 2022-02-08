 // Reset Code Object imported in AuthController

 class ResetCode {

     email; // PRIMARY KEY COMBINED WITH CODE
     code; // PRIMARY KEY COMBINED WITH EMAIL
     isActive; // IF RESET CODE IS ACTIVE OR ALREADY USED

     constructor(email, code, isActive) {
         this.email = email;
         this.code = code;
         this.isActive = isActive;
     }

 };

 module.exports = ResetCode;