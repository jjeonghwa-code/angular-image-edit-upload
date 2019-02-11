import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { mimeType } from './mime-type.validator';
import { EditImageDialogComponent } from './edit-image-dialog/edit-image-dialog.component';
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public form: FormGroup;
  public imageUrls: any[] = [];
  public defaultImageUrl: string;

  constructor(
    public appService: AppService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
  ) { this.buildForm(); }

  editImageWindow(event: Event) {
    // console.log(event);
    // this.msgs = [];
    const dialogTitle = 'Edit Image';
    const viewportWidth = 480;
    const viewPortHeight = 360;
    const boundaryWidth = 530;
    const boundaryHeight = 410;
    const file = (event.target as HTMLInputElement).files[0];

    if (file.size > 1000000) {
      // this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Image size to large' });
      return;
    } else if (file) {
      const dialogRef = this.dialog.open(EditImageDialogComponent, {
        width: '580px',
        data: {
          file,
          dialogTitle,
          viewportWidth,
          viewPortHeight,
          boundaryWidth,
          boundaryHeight,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          const control = this.form.controls.uploadImages as FormArray;
          control.push(
            this.formBuilder.group({
              image: new FormControl(result, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
              })
            })
          );
          const reader = new FileReader();
          reader.onload = () => {
            this.imageUrls.push({ url: reader.result as string });
          };
          reader.readAsDataURL(result);
        }
      });
    }
  }

  removeImage(i: number) {
    this.imageUrls.splice(i, 1);
    const control = this.form.controls.uploadImages as FormArray;
    control.removeAt(i);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      uploadImages: this.formBuilder.array([]),
    });
  }


  async onFormSubmit(form: FormGroup) {
    // this.msgs = [];
    let images;
    if (form.invalid) {
      // this.msgs.push({ severity: 'warning', summary: 'Warning', detail: 'Please fill all required form!' });
      return;
    }
    // Create new product
    if (form.value.uploadImages) {
      images = await this.appService.uploadImage(form.value.uploadImages).toPromise();
      if (images) {
        // Get images file names
        for (const image of images) {
          const control = this.form.controls.images as FormArray;
          control.push(
            this.formBuilder.group({
              image: [image, Validators.required],
            })
          );
        }
      }
    }
    // this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Your product information updated successfully!' });
  }

}
