import {ChangeDetectorRef,Component,ElementRef,OnInit,ViewChild,} from '@angular/core';
import {AbstractControl,FormBuilder,FormControl,FormGroup,ValidationErrors,ValidatorFn,Validators,} from '@angular/forms';
import { Router } from '@angular/router';
import { RestApiService } from '../service/rest-api.service';
import { Register } from '../shared/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent{
  constructor(private ProfileService: RestApiService,private cd: ChangeDetectorRef,private fb: FormBuilder,private router: Router) {}
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  submitted: true;
  profile: Register[] = [];
  ProfileData: Register;
  errorMessage = '';
  // imagePrev="./assets/profile.png";
  // url="./assets/profile.png";

  RegisterForm = new FormGroup({
    profileImg: new FormControl([]),
    firstname: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      this.alphaCharactersOnlyValidator(),
    ]),
    lastname: new FormControl(''),
    email: new FormControl(''),
    contact: new FormControl(''),
    age: new FormControl(18, []),
    state: new FormControl(''),
    country: new FormControl(''),
    address: new FormControl(''),
    tag: new FormControl([[]]),
    subscribe: new FormControl(false,[Validators.required]),
  });

  get firstName() {
    return this.RegisterForm.get('firstName')!;
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

      reader.onload = (e:any) => {
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
    this.imageUrl = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';;
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

  // onSelectFile(e:any){
  //   if(e.target.files){
  //     let reader = new FileReader();
  //     reader.readAsDataURL(e.target.files[0]);
  //     reader.onload = (event:any)=>{
  //       this.url = event.target.result;
  //       this.ProfileService.CreateProfile(e)
        
  //     }
  //   }

  // }
}
