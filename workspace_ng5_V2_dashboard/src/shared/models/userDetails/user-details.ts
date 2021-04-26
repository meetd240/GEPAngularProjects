
// Class provides instance properties for UserDetails
export class UserInfo {
    
        userName: string = "";
        emailAddress: string = "";
        contactCode: number = 0;
        isSelected: boolean = false;
        firstName: string = "";
        lastName: string = "";
        fullName: string = "";
        userId: number = 0;

        constructor(userName: string, emailAddress: string, contactCode: number, isSelected: boolean, firstName: string, lastName: string, userId: number) {
            this.userName = userName;
            this.emailAddress = emailAddress;
            this.contactCode = contactCode;
            this.isSelected = isSelected;
            this.firstName = firstName;
            this.lastName = lastName;
            this.fullName = (this.firstName == null && this.lastName == null) ? this.userName: this.firstName + " " + this.lastName;
            this.userId = userId;
        }; 

}


