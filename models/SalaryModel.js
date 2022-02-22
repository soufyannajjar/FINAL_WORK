 // Salary Object imported in WalletController

 class Salary {

     salaryId;
     FK_userId; //VIEWER ID who has received money
     salary; //How much money the VIEWER has received
     earned; //TRUE OR FALSE - Is the money earned ?
     dateOfPayment;

     constructor(salaryId, FK_userId, salary, earned, dateOfPayment) {
         this.salaryId = salaryId;
         this.FK_userId = FK_userId;
         this.salary = salary;
         this.earned = earned;
         this.dateOfPayment = dateOfPayment;
     }

 };

 module.exports = Salary;