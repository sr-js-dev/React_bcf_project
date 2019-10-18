import React from 'react';

import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import OptionTableView from './OptionView';
import OptionEdit from './OptionEdit';
import { OptionPostInfo, OptionInfo } from 'types/global';
import { CateInfo } from './types';

const styles = createStyles(theme => ({
    root: {
        padding: theme.spacing(1),
        display: 'block',
        borderTop: '1px solid #CCC',
        height: '100%',
    },
    options: {
        padding: theme.spacing(1),
    },
}));

interface ICategoryEditProps {
    classes: ClassNameMap<string>;
    edit: boolean;
    handleAdd: (catId: string, option: OptionInfo) => Promise<void>;
    handleUpdate: (id: string, data: OptionPostInfo) => Promise<void>;
    handleDelete: (catId: string, optId: string) => Promise<void>;
    category: CateInfo;
}

interface ICategoryEditState {
    editingId: string;
    adding: boolean;
    addingOption: OptionPostInfo & { id: string };
}

class CategoryEdit extends React.Component<ICategoryEditProps, ICategoryEditState> {
    constructor(props) {
        super(props);

        this.state = {
            editingId: '',
            adding: false,
            addingOption: {
                name: '',
                value: '',
                description: '',
                budget: 0,
                duration: 0,
                id: ''
            },
        };
    }

    compFunc = id => opt => opt.id === id.toString();

    handleAdd = () => {
        const options = this.props.category.options;
        let id = 0;
        while (options.length > 0) {
            // eslint-disable-line no-loop-func
            if (options.some(this.compFunc(id))) {
                id++;
                continue;
            }
            break;
        }

        this.setState({
            editingId: '',
            adding: true,
            addingOption: {
                id: id.toString(),
                name: '',
                value: '',
                description: '',
                budget: 1000,
                duration: 10,
            },
        });
    };

    handleEdit = id => {
        this.setState({ adding: false, editingId: id });
    };

    handleSave = async opt => {
        if (this.state.adding) {
            await this.props.handleAdd(this.props.category.id, opt);
        } else {
            await this.props.handleUpdate(this.props.category.id, opt);
        }
        this.setState({ adding: false, editingId: '' });
    };

    handleCancel = () => {
        this.setState({ adding: false, editingId: '' });
    };

    handleDelete = async opt => {
        await this.props.handleDelete(this.props.category.id, opt);
        this.setState({ adding: false, editingId: '' });
    };

    render() {
        const { classes, category, edit } = this.props;
        const options = category.options;

        return (
            <div className={classes.root}>
                {this.state.adding && (
                    <OptionEdit
                        option={this.state.addingOption}
                        handleSave={this.handleSave}
                        handleCancel={this.handleCancel}
                    />
                )}
                {options && (
                    <OptionTableView
                        edit={edit}
                        options={options}
                        editingId={this.state.editingId}
                        handleAdd={this.handleAdd}
                        handleSave={this.handleSave}
                        handleCancel={this.handleCancel}
                        handleDelete={this.handleDelete}
                        handleEdit={this.handleEdit}
                    />
                )}
            </div>
        );
    }
}

export default withStyles(styles)(CategoryEdit);
