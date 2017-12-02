import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-upload-file',
    templateUrl: './upload-file.component.html'
})
export class UploadFileComponent {
    @Input() isVisible: boolean;

    constructor() {

    }


}
