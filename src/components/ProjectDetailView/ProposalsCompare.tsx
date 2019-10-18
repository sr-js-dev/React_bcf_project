import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';


import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

// customized components
import CustomTableCell from 'components/shared/CustomTableCell';
import { getProposalDetails } from 'store/actions/global-actions';
import { ProjectInfo } from 'types/project';
import { ProposalDetailInfo } from 'types/proposal';

const styles = createStyles(theme => ({
	root: {
		position: 'relative',
		width: '100%',
		overflow: 'auto',
		padding: theme.spacing(1),
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)'
	},
	table: {
		border: '1px solid #CCC',
	},
	title: {
		color: theme.palette.primary.dark,
		margin: theme.spacing(0, 1, 1, 1),
		textAlign: 'center',
		fontSize: '28px',
		// color: '#333',
		fontWeight: '700',
	},
	button: {
		padding: '6px',
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	},
	header: {
		fontSize: '20px',
		color: '#FFF',
		fontWeight: '400',
		padding: '8px 16px',
	},
	template: {
		fontSize: '16px',
		color: '#FFF',
		backgroundColor: '#1c0168',
	},
	span: {
		fontSize: '18px',
		fontWeight: '500',
		backgroundColor: '#EEE',
		border: '1px solid, #CCC',
	},
}));

interface IProposalsCompareProps extends RouteComponentProps {
	classes: ClassNameMap<string>;
	proposals: Array<string>;
	project: ProjectInfo;
	getProposalDetails: (id: string) => Promise<ProposalDetailInfo>;
}

interface IProposalsCompareState {
	loading: boolean;
	data: any;
}

class ProposalsCompare extends React.Component<IProposalsCompareProps, IProposalsCompareState> {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			data: null,
		};
	}

	async componentDidMount() {
		const { proposals } = this.props;
		const data = [];
		const tasks = [];
		proposals &&
			proposals.forEach((pid, index) => {
				tasks[index] = this.props.getProposalDetails(pid);
			});

		for (let i = 0; i < tasks.length; i++) {
			const prop = await tasks[i];
			data[i] = this.createDetails(prop);
		}

		this.setState({ loading: false, data });
		// console.log(data);
	}

	createDetails = data => {
		const { project } = this.props;

		const details = [];
		project.projectTemplates.forEach((templ, index) => {
			const cats = templ.template.categoryList;
			details[index] = {};
			details[index].id = templ.template.id;
			details[index].name = templ.template.name;
			details[index].budget = 0;
			details[index].duration = 0;
			cats.forEach(cat => {
				details[index][cat.id] = {};
				details[index][cat.id].id = cat.id;
				details[index][cat.id].type = cat.type;
				details[index][cat.id].name = cat.name;
				details[index][cat.id].value = cat.value;
				details[index][cat.id].description = cat.description;
				details[index][cat.id].options = [];
			});
		});

		let budget = 0,
			duration = 0;
		data.temCatOptionDetail &&
			data.temCatOptionDetail.forEach(template => {
				for (let tid in template) {
					for (let det of details) {
						if (det.id !== tid) continue;

						det.budget = 0;
						det.duration = 0;
						const cats = template[tid];
						for (let cat of cats) {
							for (let cid in cat) {
								det[cid].options = cat[cid] || [];
								det[cid].selected =
									det[cid].options[0] && det[cid].options[0].id;
								if (!!det[cid].selected) {
									det.budget += det[cid].options[0].budget;
									det.duration += det[cid].options[0].duration;
								}
							}
						}

						budget += det.budget;
						duration += det.duration;
						break;
					}
				}
			});

		// details.forEach(templ => {
		//     let minamount = [0, 0];
		//     let mintime = [0, 0];
		//     for (let cid in templ) {
		//         let cmintime = 0, cminamount = 0;
		//         if (cid !== 'id' && cid !== 'name') {
		//             const options = templ[cid].options;
		//             if (options[0]) {
		//                 cminamount = options[0].budget;
		//                 cmintime = options[0].duration;
		//             }
		//             for (let opt of options) {  // minamount
		//                 if (cminamount > opt.budget) {
		//                     cminamount = opt.budget;
		//                     cmintime = opt.duration;
		//                 }
		//             }
		//             minamount[0] += cminamount;
		//             minamount[1] += cmintime;

		//             if (options[0]) {
		//                 cminamount = options[0].budget;
		//                 cmintime = options[0].duration;
		//             }
		//             for (let opt of options) {  // mintime
		//                 if (cmintime > opt.duration) {
		//                     cminamount = opt.budget;
		//                     cmintime = opt.duration;
		//                 }
		//             }
		//             mintime[0] += cminamount;
		//             mintime[1] += cmintime;
		//         }
		//     }

		//     templ.mintime = [...mintime];
		//     templ.minamount = [...minamount];
		// });

		const prop = {
			mail: data.proposal.subContractor.email,
			budget: budget,
			duration: duration,
			proposal: [...details],
		};
		return prop;
	};

	handleOptChanged = (idx, tid, cid, oid) => {
		// console.log(idx, tid, cid, oid);
		const { data } = this.state;

		const { project } = this.props;
		if (!project || !project.projectTemplates) return;

		const proposal = data[idx].proposal;
		if (!proposal) return;

		for (let templ of proposal) {
			if (templ.id !== tid) continue;

			if (templ[cid]) {
				templ[cid].selected = oid;
			}
		}

		// calculate the budget and duration
		let budget = 0,
			duration = 0;
		for (let templ of proposal) {
			templ.budget = 0;
			templ.duration = 0;
			for (let template of project.projectTemplates) {
				if (template.template.id === templ.id) {
					const cats = template.template.categoryList;

					for (let cat of cats) {
						if (templ[cat.id] && templ[cat.id].selected) {
							const selected = templ[cat.id].selected;
							const options = templ[cat.id].options;
							if (options) {
								for (let opt of options) {
									if (opt.id === selected) {
										templ.budget += opt.budget;
										templ.duration += opt.duration;
										break;
									}
								}
							}
						}
					}
					break;
				}
			}

			budget += templ.budget;
			duration += templ.duration;
		}

		data[idx].budget = budget;
		data[idx].duration = duration;
		// console.log(budget, duration);
		// console.log(this.state.data);
		this.setState({ data: [...data] });
	};

	isChecked = (idx, tid, cid, oid) => {
		const proposal = this.state.data[idx].proposal;
		if (!proposal) return false;

		for (let templ of proposal) {
			if (templ.id !== tid) continue;

			if (templ[cid]) {
				return templ[cid].selected === oid;
			}
		}

		return false;
	};

	render() {
		const { classes, proposals, project } = this.props;
		const { loading, data } = this.state;

		if (!project) {
			return <Box>No Project selected</Box>;
		}

		if (!proposals || proposals.length < 2) {
			return <Box>No Proposals selected</Box>;
		}

		if (loading || !data) {
			return (
				<Box className={classes.root}>
					<CircularProgress className={classes.busy} />
				</Box>
			);
		}

		return (
			<Box className={classes.root}>
				<Typography className={classes.title} gutterBottom>
					Project: {project.title}
				</Typography>
				<Box className={classes.table}>
					<Table size="small">
						{data.length === 2 && (
							<colgroup>
								<col width="20%" />
								<col width="5%" />
								<col width="35%" />
								<col width="5%" />
								<col width="35%" />
							</colgroup>
						)}
						{data.length === 3 && (
							<colgroup>
								<col width="16%" />
								<col width="4%" />
								<col width="24%" />
								<col width="4%" />
								<col width="24%" />
								<col width="4%" />
								<col width="24%" />
							</colgroup>
						)}
						<TableHead>
							<TableRow>
								<CustomTableCell className={classes.header}>
									Categories
                				</CustomTableCell>
								{data && data.map((proposal, idx) => (
									<CustomTableCell key={idx} colSpan={2} className={classes.header}>
										{proposal.mail}
									</CustomTableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{project &&
								project.projectTemplates &&
								project.projectTemplates.map((templ, index) => (
									<React.Fragment key={templ.id + index}>
										<TableRow className={classes.row}>
											<CustomTableCell
												colSpan={data.length * 2 + 1}
												className={classes.template}
											>
												Template: {templ.template.name}
											</CustomTableCell>
										</TableRow>
										{templ.template.categoryList &&
											templ.template.categoryList.map((cat, idx) => {
												let maxOpts = 0;
												for (let datum of data) {
													for (let temp of datum.proposal) {
														if (temp.id === templ.template.id) {
															let optCnt = temp[cat.id]
																? temp[cat.id].options.length
																: 0;
															if (maxOpts < optCnt) maxOpts = optCnt;
															break;
														}
													}
												}

												const list = [];
												for (let i = 0; i < maxOpts; i++) {
													list.push(i);
												}
												return (
													<React.Fragment key={cat.id + idx}>
														{list.map(i => (
															<TableRow className={classes.row} key={i}>
																{i === 0 && (
																	<CustomTableCell
																		className={classes.span}
																		rowSpan={maxOpts}
																	>
																		{cat.name}
																	</CustomTableCell>
																)}
																{data.map((datum, idx) => {
																	for (let temp of datum.proposal) {
																		if (temp.id === templ.template.id) {
																			const option =
																				temp[cat.id] &&
																				temp[cat.id].options &&
																				temp[cat.id].options[i];
																			if (!!option) {
																				return (
																					<React.Fragment key={idx}>
																						<CustomTableCell>
																							<Radio
																								onChange={() =>
																									this.handleOptChanged(
																										idx,
																										templ.template.id,
																										cat.id,
																										option.id
																									)
																								}
																								value={option.id}
																								checked={this.isChecked(
																									idx,
																									templ.template.id,
																									cat.id,
																									option.id
																								)}
																								inputProps={{
																									'aria-label': option.id,
																								}}
																							/>
																						</CustomTableCell>
																						<CustomTableCell>
																							Name: {option.name} <br />
																							Value: {option.value} <br />
																							{option.budget} $ in{' '}
																							{option.duration} days
                                            											</CustomTableCell>
																					</React.Fragment>
																				);
																			} else {
																				return (
																					<React.Fragment key={idx}>
																						<CustomTableCell></CustomTableCell>
																						<CustomTableCell>
																							None
                                            											</CustomTableCell>
																					</React.Fragment>
																				);
																			}
																		}
																		return null;
																	}
																	return null;
																})}
															</TableRow>
														))}
													</React.Fragment>
												);
											})}
										<TableRow className={classes.row} hover>
											<CustomTableCell className={classes.span}>
												Template Total
                      						</CustomTableCell>
											{data.map((datum, idx) => {
												for (let temp of datum.proposal) {
													if (temp.id === templ.template.id) {
														return (
															<React.Fragment key={idx}>
																<CustomTableCell></CustomTableCell>
																<CustomTableCell>
																	{temp.budget} $ in {temp.duration} days
                                								</CustomTableCell>
															</React.Fragment>
														);
													}
												}

												return null;
											})}
										</TableRow>
									</React.Fragment>
								))}
							<TableRow className={classes.row}>
								<CustomTableCell className={classes.span}>
									Project Total
                				</CustomTableCell>
								{data.map((datum, idx) => {
									// let mintime = [0, 0], minamount = [0, 0];
									// for (let prop of datum.proposal) {
									//     mintime[0] += prop.mintime[0];
									//     mintime[1] += prop.mintime[1];
									//     minamount[0] += prop.minamount[0];
									//     minamount[1] += prop.minamount[1];
									// }

									return (
										<React.Fragment key={idx}>
											<CustomTableCell></CustomTableCell>
											<CustomTableCell>
												{datum.budget} $ in {datum.duration} days
                      						</CustomTableCell>
										</React.Fragment>
									);
								})}
							</TableRow>
						</TableBody>
					</Table>
				</Box>
			</Box>
		);
	}
}

const mapStateToProps = state => ({
	proposals: state.global_data.compareProps,
	project: state.global_data.project,
});

const mapDispatchToProps = dispatch => ({
	getProposalDetails: id => dispatch(getProposalDetails(id)),
});

const ConnectedProposalsCompare = connect(
	mapStateToProps,
	mapDispatchToProps
)(ProposalsCompare);

export default withStyles(styles)(ConnectedProposalsCompare);
