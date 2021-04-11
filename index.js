const instance_skeleton = require('../../instance_skel');


const getVariableName = i => 'var_' + i;
const getVariableValueName = i => 'label_' + i;
const forEachVariable = (self, closure) => {
    for (let i = 1; i <= self.config.count; i++) {
        closure(i)
    }
}


function instance(system, id, config) {
    const self = this;
    // self.system = system;
    // self.id = id;

    // super-constructor
    instance_skeleton.apply(this, arguments);

    if (process.env.DEVELOPER) {
        self.config._configIdx = -1;
    }

    return self;
}

instance.prototype.init = function () {
    const self = this;
    self.status(self.STATUS_OK);
    self.update_variables();
};

instance.prototype.config_fields = function () {
    const self = this;
    const fields = [
        {
            type: 'text',
            id: 'info',
            width: 12,
            label: 'Information',
            value: 'This module creates the option to set some custom variables, that can be reused within and across page. For example, ' +
                'it allows to assign names to presets, where you have buttons to store and to recall the preset that should share a text.'
        },
        {
            type: 'number',
            id: 'count',
            label: 'Number of variables',
            width: 2,
            default: 6
        }
    ];

    forEachVariable(self, i => {
        fields.push({
            type: 'textinput',
            id: getVariableValueName(i),
            label: 'Label ' + i,
            width: 12,
            default: '?'
        });
    })

    return fields;
};

instance.prototype.update_variables = function () {
    const self = this;
    const variables = [];

    const setVariable = (i, value) => self.setVariable(getVariableName(i), value);

    forEachVariable(self, i => {
        variables.push({label: 'Variable #' + i, name: getVariableName(i)});

        const value = self.config[getVariableValueName(i)];
        setVariable(i, value);

        // work around for use of recursive variable
        if (/\$\([^:$)]+:[^)$]+\)/.test(value)) {
            setVariable(i, value + ' ');
            setVariable(i, value);
        }
    })

    self.setVariableDefinitions(variables);
};

instance.prototype.updateConfig = function (config) {
    const self = this;
    self.config = config;

    self.update_variables();

    // self.system.emit('instance_edit', self.id);
};

instance_skeleton.extendedBy(instance);
exports = module.exports = instance;
