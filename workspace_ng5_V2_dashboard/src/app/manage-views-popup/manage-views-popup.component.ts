import {
    Input, Component, OnInit,ViewEncapsulation, ElementRef} from '@angular/core';


declare var $: any;

@Component({
    selector: 'manage-views-popup',
    templateUrl: './manage-views-popup.component.html',
    styleUrls: ['./manage-views-popup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
})
export class ManageViewsPopupComponent implements OnInit {

    manageviewsdata: any = [
        {
            title: 'Spend and income views Name 1',
            isOwn: false,
            titleViewFlg: true,
            editViewFlg: false,
            user: 'Ravivarma sagi',
            createdOn: '06-07-2018',
            modifiedOn: '06-07-2018',
        },
        {
            title: 'Spend and income views Name 2',
            isOwn: true,
            titleViewFlg: true,
            editViewFlg: false,
            user: [
                {
                    name: 'josep powel',
                    email: 'josep.powel@xyz.com'
                },
                {
                    name: 'harry powel',
                    email: 'harry.powel@xyz.com'
                },
                {
                    name: 'robert powel',
                    email: 'robert.powel@xyz.com'
                },
                {
                    name: 'john powel',
                    email: 'john.powel@xyz.com'
                }
            ],
            createdOn: '06-07-2018',
            modifiedOn: '06-07-2018',

        },
        {
            title: 'Spend and income views Name 3',
            isOwn: false,
            titleViewFlg: true,
            editViewFlg: false,
            user: 'Ravivarma sagi',
            createdOn: '06-07-2018',
            modifiedOn: '06-07-2018',
        },
        {
            title: 'Spend and income views Name 4',
            isOwn: false,
            titleViewFlg: true,
            editViewFlg: false,
            user: 'Ravivarma sagi',
            createdOn: '06-07-2018',
            modifiedOn: '06-07-2018',
        },
        {
            title: 'Spend and income views Name 5',
            isOwn: false,
            titleViewFlg: true,
            editViewFlg: false,
            user: 'Ravivarma sagi',
            createdOn: '06-07-2018',
            modifiedOn: '06-07-2018',
        }
    ];
    checkboxConfig: any = {
        disable: false,
        isMandatory: true,
        isVisible: false,
        label: '',
        validate: true,
        focus: true,
        errorMessage: 'Error message'
    };
    btnDoneConfig: any = {
        title: "Done",
        flat: true
    };
    btnCancelConfig: any = {
        title: "Cancel",
        flat: true
    };
    smartTextFieldConfig: any = {
        label: 'Create New',
        isMandatory: true,
        disabled: false,
        data:'value',
        tabIndex: 2,
        attributes: {
            placeholder: '',
            maxLength: 100,
        }
    };
    smartTextFieldEditConfig: any = {
        label: 'Edit',
        isMandatory: true,
        disabled: false,
        data:'value',
        tabIndex: 2,
        attributes: {
            maxLength: 100,
        }
    };
    searchListConfig:any ={
        label: '',
        data:'value',
    };
    searchTooltipConfig: any = {
        message: "Search",
        position: "bottom"
    };
    closeTooltipConfig: any = {
        message: "Close",
        position: "bottom"
    };
    editTooltipConfig: any = {
        message: "Edit",
        position: "bottom"
    };
    deleteTooltipConfig: any = {
        message: "Delete",
        position: "bottom"
    };
    duplicateTooltipConfig: any = {
        message: "Duplicate",
        position: "bottom"
    };
    unshareTooltipConfig: any = {
        message: "UnShare",
        position: "bottom"
    };
    doneEnableFlg: boolean = true;
    checkboxModel: any = true;
    isActiveSearch: boolean = false;
    closeSearch: boolean = false;
    searchKeyText: any= {"value": ''};
    createNewText: any = {"value":''};
    createNewEditFlg: boolean = false;
    editTitleText: any = {"value": ''};
    changeMode: any;
    prevIndexForCopyEdit: any;
    
    @Input() data: any;

    constructor(private element: ElementRef) {

    }

    ngOnInit() {


    }

    copySelection() {

        for (let item of this.manageviewsdata) {
            if (item.isChecked === true) {
                return this.doneEnableFlg = false;
            }
            else {
                this.doneEnableFlg = true;
            }
        }
    }

    showSearch() {
        let $element = $(this.element.nativeElement);
        let inputField = $element.find('.searchWithHiddenTextField .input-field input');
        inputField.focus().blur().focus().val(inputField.val());
        //inputField.focus().blur().focus().val(inputField.val());
        this.isActiveSearch = true;
        this.closeSearch = true;
    }

    hideSearch() {
        this.isActiveSearch = false;
        this.closeSearch = false;
        this.searchKeyText.value = '';
    }

    manageViewDone() {
        this.data.doneCallback();
    }
    manageViewCancel() {
        this.data.cancelCallback();
    }

    editClick(index) {
        if (this.prevIndexForCopyEdit != undefined && this.prevIndexForCopyEdit != index) {
            this.manageviewsdata[this.prevIndexForCopyEdit].editViewFlg = false;
            if (this.changeMode === 'Edit') {
                this.manageviewsdata[this.prevIndexForCopyEdit].titleViewFlg = true;
            }
        }
        this.createNewEditFlg = false;
        this.prevIndexForCopyEdit = index;
        this.smartTextFieldEditConfig.label = 'Edit';
        this.editTitleText.value = this.manageviewsdata[index].title;
        this.manageviewsdata[index].titleViewFlg = false;
        this.manageviewsdata[index].editViewFlg = true;
        this.changeMode = 'Edit';
        //Add focus to previously hidden input field, timeout needed for finding DOM elements
        setTimeout(() => {
            let $element = $(this.element.nativeElement),
            inputField = $element.find('.editCopy .input-field input');
            inputField.focus().val(inputField.val());
        });
    }

    copyClick(index) {
        if (this.prevIndexForCopyEdit != undefined && this.prevIndexForCopyEdit != index) {
            this.manageviewsdata[this.prevIndexForCopyEdit].editViewFlg = false;
            if (this.changeMode === 'Edit') {
                this.manageviewsdata[this.prevIndexForCopyEdit].titleViewFlg = true;
            }
        }
        this.createNewEditFlg = false;
        this.prevIndexForCopyEdit = index;
        this.smartTextFieldEditConfig.label = 'Create Duplicate';
        this.editTitleText.value = 'Copy of ' + this.manageviewsdata[index].title;
        this.manageviewsdata[index].editViewFlg = true;
        this.changeMode = 'Copy';
        //Add focus to previously hidden input field, timeout needed for finding DOM elements
        setTimeout(() => {
            let $element = $(this.element.nativeElement),
            inputField = $element.find('.editCopy .input-field input');
            inputField.focus().val(inputField.val());
        });
    }

    closeEditTitle(event, index) {
        event.preventDefault();
        this.manageviewsdata[index].titleViewFlg = true;
        this.manageviewsdata[index].editViewFlg = false;
    }

    updateEditTitle(index) {
        this.manageviewsdata[index].titleViewFlg = true;
        this.manageviewsdata[index].editViewFlg = false;
        if (this.changeMode === 'Edit') {
            this.manageviewsdata[index].title = this.editTitleText.value;
        }
        if (this.changeMode === 'Copy') {
            let obj = {
                title: this.editTitleText.value,
                isOwn: true,
                titleViewFlg: true,
                editViewFlg: false,
                user: '',
                createdOn: '09-07-2018',
                modifiedOn: '09-07-2018'

            };
            this.manageviewsdata.splice(index + 1, 0, obj);
        }

    }

    openCreateNewEdit() {
        this.createNewEditFlg = true;

        //inputField.focus().blur().focus().val(inputField.val());
        if (this.changeMode != undefined) {
            if (this.changeMode === 'Edit') {
                this.manageviewsdata[this.prevIndexForCopyEdit].titleViewFlg = true;
                this.manageviewsdata[this.prevIndexForCopyEdit].editViewFlg = false;
            } else {
                this.manageviewsdata[this.prevIndexForCopyEdit].editViewFlg = false;
            }
        }
       

        //Add focus to previously hidden input field
        setTimeout(() => {
            let $element = $(this.element.nativeElement),
            inputField = $element.find('.createNewEdit .input-field input');
    
            inputField.focus().val(inputField.val());
        });

    }

    closeCreateNew(event) {
        event.preventDefault();
        this.createNewEditFlg = false;
        this.createNewText.value = '';
    }

 

    updateCreateNew() {
        let obj = {
            title: this.createNewText.value,
            isOwn: true,
            titleViewFlg: true,
            editViewFlg: false,
            user: '',
            createdOn: '09-07-2018',
            modifiedOn: '09-07-2018'
        };
        this.manageviewsdata.unshift(obj);
        this.createNewText.value = '';
        this.createNewEditFlg = false;

        let $element = $(this.element.nativeElement);
        let manageViewList = $element.find('.viewsDataList');
        manageViewList[0].scrollTop = 0;
        
    
    }

  
    removeUser(Index, childIndex) {
        let mainIndex = Index,
            userIndex = childIndex;
        this.manageviewsdata[mainIndex].user.splice(userIndex, 1);
    }

    confirmDelete = function (index) {
        let notifyObj = {
            type: "confirm",
            message: "Are you sure you want to delete this view?",
            buttons: [
                {
                    title: "YES",
                    flat: true,
                    result: "yes"
                },
                {
                    title: "NO",
                    result: "no",
                    flat: true
                }]
        };
        this.notification.notify(notifyObj, (response) => {
            if (response.result === 'yes') {
                this.deleteView(index);
            } else {
                return;
            }

        });

    }

    deleteView(index) {
        let mainIndex = index;
        this.manageviewsdata.splice(mainIndex, 1);
    }
}