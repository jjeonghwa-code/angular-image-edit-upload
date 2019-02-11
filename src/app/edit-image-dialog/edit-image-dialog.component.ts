import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Croppie from 'croppie';

@Component({
    selector: 'app-edit-image-dialog',
    templateUrl: './edit-image-dialog.component.html',
    styleUrls: ['./edit-image-dialog.component.scss']
})
export class EditImageDialogComponent implements OnInit {
    @ViewChild('myimage', { read: ElementRef }) myImage: ElementRef;
    productImageUpload;
    rawImg: string;
    constructor(
        public dialogRef: MatDialogRef<EditImageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.editImage();
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onSaveClick() {
        this.productImageUpload.result('blob').then(blob => {
            const fileToUpload = blob;
            this.dialogRef.close(fileToUpload);
        });
    }

    async editImage() {
        this.productImageUpload = await new Croppie(this.myImage.nativeElement,
            {
                viewport: { width: this.data.viewportWidth, height: this.data.viewPortHeight },
                boundary: { width: this.data.boundaryWidth, height: this.data.boundaryHeight },
                showZoomer: true
            });
        if (this.productImageUpload) {
            const reader = new FileReader();
            reader.onload = () => {
                this.rawImg = reader.result as string;
            };
            reader.readAsDataURL(this.data.file);
            setTimeout(() => {
                this.productImageUpload.bind({
                    url: this.rawImg,
                    orientation: 4
                });
            }, 500);
        }
    }

}
