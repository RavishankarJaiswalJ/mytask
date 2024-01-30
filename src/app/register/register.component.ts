import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RestApiService } from '../service/rest-api.service';
import { Register } from '../shared/register';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private ref: MatDialogRef<RegisterComponent>,
    private ProfileService: RestApiService,
    public cd: ChangeDetectorRef,
    public fb: FormBuilder,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  editData: any;

  inputdata: any;
  ngOnInit(): void {
    this.inputdata = this.data;
    if (this.inputdata.code > 0) {
      this.setpopupdata(this.inputdata.code);
    }
  }
  submitted: true;
  profile: Register[] = [];
  ProfileData: Register;
  errorMessage = '';

  RegisterForm = new FormGroup({
    id: new FormControl({ value: '', disabled: true }),
    profileImg: new FormControl([]),
    firstname: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      this.alphaCharactersOnlyValidator(),
    ]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    contact: new FormControl('', [Validators.required]),
    age: new FormControl(
      18,
      Validators.compose([Validators.required, Validators.max(60)])
    ),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    tag: new FormControl(
      [[]],
      Validators.compose([Validators.required, this.tagsFilledValidator()])
    ),
    subscribe: new FormControl(false, [Validators.required]),
  });

  private imageSizeValidator() {
    return (control:any) => {
      const file: File = control.value;

      if (!file) {
        return null; // No file, no validation
      }

      // Validate pixel size using regex
      const regex = new RegExp(`^data:image/(jpeg|png|gif);base64,[A-Za-z0-9+/]+={0,2};(width=${310}&height=${325}|height=${325}&width=${310})$`);

      const reader = new FileReader();

      reader.onload = (e: any) => {
        const imageDataUrl = e.target.result;

        if (!regex.test(imageDataUrl)) {
          control.setErrors({ imageSize: true });
        } else {
          control.setErrors(null);
        }
      };

      reader.readAsDataURL(file);

      return null;
    };
  }




  tagsFilledValidator() {
    return (control: AbstractControl) => {
      const tags = control.value;
      const isValid = tags && tags.length > 0;
      return isValid ? null : { tagsNotFilled: true };
    };
  }

  get firstName() {
    return this.RegisterForm.get('firstName');
  }
  get lastname() {
    return this.RegisterForm.get('lastname');
  }
  get email() {
    return this.RegisterForm.get('email');
  }
  get contact() {
    return this.RegisterForm.get('contact');
  }
  get age() {
    return this.RegisterForm.get('age');
  }
  get state() {
    return this.RegisterForm.get('state');
  }
  get country() {
    return this.RegisterForm.get('country');
  }
  get address() {
    return this.RegisterForm.get('address');
  }
  get tag() {
    return this.RegisterForm.get('tag');
  }
  get subscribe() {
    return this.RegisterForm.get('subscribe');
  }

  tags: string[] = [];
  selectable = true;
  removable = true;
  disabled = false;
  max = 100;
  min = 18;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 18;

  addTag(event: any): void {
    const value = event.target.value.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }
    event.target.value = '';
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index !== -1) {
      this.tags.splice(index, 1);
    }
  }

  onCancel() {
    this.router.navigate(['home']);
  }

  alphaCharactersOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^[a-zA-Z]+$/;
      const isValid = regex.test(control.value);
      return isValid ? null : { alphaCharactersOnly: true };
    };
  }
  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = './assets/profile.png';
  editFile: boolean = true;
  removeUpload: boolean = false;

  uploadFile(event: any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      reader.onload = (e: any) => {
        this.imageUrl = reader.result;

        this.RegisterForm.patchValue({
          profileImg: this.imageUrl,
        });
        this.editFile = false;
        this.removeUpload = true;
      };
      this.cd.markForCheck();
    }
  }

  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl = '';
    this.editFile = true;
    this.removeUpload = false;
    this.RegisterForm.patchValue({
      profileImg: [],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.RegisterForm.valid) {
      if (this.RegisterForm.dirty) {
        const p = { ...this.ProfileData, ...this.RegisterForm.value };
        if (p.firstname) {
          this.ProfileService.CreateProfile(p).subscribe({
            next: () => this.OnSaveCompleted(),
            error: (err) => (this.errorMessage = err),
          });
        }
      }
    } else {
      console.log(this.RegisterForm.value);
    }
  }
  OnSaveCompleted() {
    this.RegisterForm.reset();
    this.router.navigate(['profile']);
  }

  

  setpopupdata(code: any) {
    this.ProfileService.getProfileById(code).subscribe((res) => {
      this.editData = res;
      this.RegisterForm.setValue({
        id: this.editData.id,
        profileImg: this.editData.profileImg,
        firstname: this.editData.firstname,
        lastname: this.editData.lastname,
        email: this.editData.email,
        contact: this.editData.contact,
        age: this.editData.age,
        state: this.editData.state,
        country: this.editData.country,
        address: this.editData.address,
        tag: this.editData.tag,
        subscribe: this.editData.subscribe,
      });
    });
  }
}
