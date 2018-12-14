import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-create-admin',
    templateUrl: './create-admin.component.html',
    styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent implements OnInit {
    form: FormGroup;
    constructor(private formBuilder: FormBuilder, private commonService: CommonService) { }

    ngOnInit() {
        this.buildFormControl();
    }

    buildFormControl() {
        this.form = this.formBuilder.group({
            userName: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required,
            Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
            confirmPassword: new FormControl('', [Validators.required]),
        }, { validator: this.checkPasswords });
    }

    checkPasswords(group: FormGroup): { [key: string]: any } | null {
        const password = group.get('password').value;
        const cnfPassword = group.get('confirmPassword').value;
        return (password && cnfPassword && password !== cnfPassword) ? { notSame: true } : null;
    }

    save() {
        if (this.form.valid) {
            const body = {
                adminId: this.form.get('userName').value,
                password: this.form.get('password').value,
                confirmPassword: this.form.get('confirmPassword').value
            };
            this.commonService.createAdmin(body).subscribe((response) => {
                if (response.status === '') {
                    this.commonService.triggerAlerts(
                        { message: 'Admin created successfully.', showAlert: true, isSuccess: true });
                    this.resetForm();
                } else {
                    this.commonService.triggerAlerts(
                        {
                            message: 'Already user exists with same user name, Please try with different user name',
                            showAlert: true, isSuccess: false
                        });
                }
            },
                (error) => {
                    this.commonService.triggerAlerts(
                        { message: 'Something went wrong. Please try again in some time.', showAlert: true, isSuccess: false });
                });
        }
    }

    validateAdmin() {
        const control = this.form.get('userName');
        if (control.valid && control.value && control.value.length > 0) {
          this.commonService.validateAdmin(control.value).subscribe((response) => {
            if (response.body.errorMessage === `Admin Id is not exist`) {
              control.setErrors(null);
            } else {
              control.setErrors({'userNameNotUnique': true });
            }
          });
        }
      }

    // validateAdmin() {
    //     if (this.form.get('userName').valid) {
    //         this.commonService.vaidateAdmin(this.form.get('userName').value).subscribe((response) => {
    //             if (response.status === '') {
    //                 this.commonService.triggerAlerts(
    //                     { message: 'Admin created successfully.', showAlert: true, isSuccess: true });
    //                 this.resetForm();
    //             } else {
    //                 this.commonService.triggerAlerts(
    //                     {
    //                         message: 'Already user exists with same user name, Please try with different user name',
    //                         showAlert: true, isSuccess: false
    //                     });
    //             }
    //         },
    //             (error) => {
    //                 this.commonService.triggerAlerts(
    //                     { message: 'Something went wrong. Please try again in some time.', showAlert: true, isSuccess: false });
    //             });
    //     }
    // }

    resetForm() {
        this.form.reset({
            userName: '',
            emailId: '',
            password: '',
            confirmPassword: ''
        });
    }
}
