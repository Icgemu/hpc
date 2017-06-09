import React from 'react';

const FormGroupMinxin = {
    contextTypes: {
        formGroup: React.PropTypes.object
    },
    getFormGroup() {
        return this.context.formGroup || {};
    }
};

export default FormGroupMinxin;
