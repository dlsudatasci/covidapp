import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import ReactDataSheet from 'react-datasheet';
import SaveIcon from '@material-ui/icons/Save';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ComputerIcon from '@material-ui/icons/Computer';
import Chart from "react-google-charts";

import axios from "axios"
import React from 'react';
import Toast from 'light-toast';
import exportFromJSON from "export-from-json";
import Papa from 'papaparse';
import { Button, TextField, Box, Chip, Grid, Radio, Container, FormControlLabel, RadioGroup, InputAdornment, Icon, FormControl, Input, MenuItem, Select, Slider, Typography } from '@material-ui/core';

// Production
const apiBase = 'https://api.covidapp.manzano.tech/'
// Staging
// const apiBase = 'http://13.229.47.250:5000/'
// Development
// const apiBase = 'http://localhost:5000/'

const styles = {
  modelContainer: {
    textAlign: 'left',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    paddingTop: 10,
    paddingBottom: 10,
  },
  mainForm: {
    minHeight: '90vh',
    maxHeight: 'auto',
    margin: 0,
    paddingBottom: 20,
  },
  resultContainer: {
    textAlign: 'left',
    marginTop: 10
  },
  result: {
    paddingLeft: 10,
    marginBottom: 7,
  },
  allocateBtn: {
    float: 'right',
    marginRight: 5,
  },
  table: {
    '& td': {
      paddingBottom: 5,
      paddingTop: 5,
      minWidth: 30,
    },
    '& span.value-viewer': {
      padding: 7,
    }
  },
  sliderBox: {
    textAlign: 'left'
  },
};

// function importAll(r) {
//   return r.keys().map(r);
// }

// const predefined = importAll(require.context('../predefined', false, /\.(csv)$/));
// console.log(predefined)

class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      groupName: "",
      grid: [
        // [{value: 0}]
      ],
      ve: 98,
      results: null,
      model: 'minV',
      vac_type: ['Vac A'],
      vac_avail: 187,
      chartData: [],
      vaccines: [],
      vaccineName: "",
      testCase: "Household",
      testCaseOptions: ["Household","School","Workplaces","Public"],
      resultsGrid: []
    };

    this.addGroup = this.addGroup.bind(this);
    this.addVaccine = this.addVaccine.bind(this);
    this.allocate = this.allocate.bind(this);
    this.loadTestCase = this.loadTestCase.bind(this);
    this.save = this.save.bind(this);
  }

  // handling change for text box values (Group, vaccine efficacy)
  handleChange(event) {
    let fieldName = event.target.name;
    let fieldVal = event.target.value;
    this.setState({
      [fieldName]: fieldVal
    })
  }

  // handling change for population size values
  handlePopulationChange(event) {
    let groupName = event.target.name;
    let fieldVal = event.target.value;
    let grpsClone = JSON.parse(JSON.stringify(this.state)).groups
    let index = grpsClone.findIndex((item) => item.name === groupName);
    grpsClone[index].population = fieldVal
    this.setState({
      groups: grpsClone
    })
  }

  // handling change for efficacy values
  handleEfficacyChange(event) {
    let vacName = event.target.name;
    let fieldVal = event.target.value;
    let vacsClone = JSON.parse(JSON.stringify(this.state)).vaccines;
    let index = vacsClone.findIndex((item) => item.name === vacName);
    vacsClone[index].efficacy = fieldVal;
    this.setState({
      vaccines: vacsClone
    })
  }

  // handling change for dose values
  handleDoseChange(event) {
    let vacName = event.target.name;
    let fieldVal = event.target.value;
    let vacsClone = JSON.parse(JSON.stringify(this.state)).vaccines;
    let index = vacsClone.findIndex((item) => item.name === vacName);
    vacsClone[index].doses = fieldVal;
    this.setState({
      vaccines: vacsClone
    })
  }

  // handling change for vaccine name
  handleNameChange(event) {
    let vacName = event.target.name;
    let fieldVal = event.target.value;
    let vacsClone = JSON.parse(JSON.stringify(this.state)).vaccines;
    let index = vacsClone.findIndex((item) => item.name === vacName);
    console.log(index);
    vacsClone[index].name = fieldVal;
    this.setState({
      vaccines: vacsClone
    })
  }

  // helper function for contact grid
  addToPrev(prevGrid, newVal) {
    prevGrid.forEach(row => {
      while (row.length !== newVal) {
        row.push({ value: 0 })
      }
    })
    return prevGrid
  }

  // helper function for results grid
  addToPrevVac(prevGrid, newVal) {
    prevGrid.forEach(row => {
      while (row.length !== newVal) {
        row.push({ result: '--' })
      }
    })
    return prevGrid

  }

  // adding new population group, updating state for groups array and contact grid
  addGroup() {
    let name = this.state.groupName
    if (name.trim() === "") return
    this.setState(prevState => ({
      groupName: "",
      groups: [...prevState.groups, {
        name,
        population: 200,
        result: "--"
      }],
      grid: [
        ...this.addToPrev(prevState.grid, prevState.groups.length + 1),
        Array.apply(null, Array(prevState.groups.length + 1)).map(function () { return { value: 0 } })
      ],
      resultsGrid: [...this.addToPrevVac(prevState.resultsGrid, prevState.groups.length + 1)
        // Array.apply(null, Array(prevState.groups.length + 1)).map(function () { return { result: 0 } })
      ]
    }))
  }

  // for removing population groups
  removeGroup = name => () => {
    let groupName = name;
    let grpsClone = JSON.parse(JSON.stringify(this.state)).groups
    let index = -1
    grpsClone.find(function (item, i) {
      if (item.name === groupName) {
        index = i
        return i
      }
      return 0
    });
    grpsClone.splice(index, 1);
    this.setState(prevState => ({
      groups: grpsClone,
      grid: [
        ...this.removeFromPrev(prevState.grid, index, prevState.groups.length - 1),
      ],
      resultsGrid:[
        ...this.removeFromPrevResults(prevState.resultsGrid, index, prevState.groups.length - 1),
      ]
    }))
  }

  removeFromPrevResults(prevGrid, index, newVal){
    prevGrid.forEach(row => {
      while (row.length !== newVal) {
        row.splice(index,1)
      }
    })
    return prevGrid
  }

  // helper function for contact grid
  removeFromPrev(prevGrid, index, newVal) {
    while (prevGrid.length !== newVal) {
      prevGrid.splice(index,1)
    }

    prevGrid.forEach(row => {
      while (row.length !== newVal) {
        row.splice(index,1)
      }
    })
    return prevGrid
  }

  // for allocate button
  allocate() {
    // if (this.state.model === 'minR') {
    //   Toast.info("No model set up for minR yet", 250)
    //   return
    // }

    if (!this.checkValues()) return;

    



    Toast.loading('Optimizing...')

    // build API URL
    let cellValues = []
    this.state.grid.forEach((row, ri) => {
      // console.log(row)
      row.forEach((cell, ci) => {
        cellValues.push(parseFloat(cell.value))
      })
    });

    const groups = this.state.groups.map(group => `"${group.name}"`);
    const pop = this.state.groups.map(group => group.population);
    const fn0 = [0.5, 0.5];
    // const ve = this.state.ve / 100;
    const ve = this.state.vaccines.map(vac => parseFloat(vac.efficacy / 100.0))
    const vac_type = this.state.vaccines.map(vac => `"${vac.name}"`)
    const vac_avail = this.state.vaccines.map(vac => vac.doses)
    const model = `"${this.state.model}"`

    let apiURL = apiBase + `solve?groups=[${groups}]&N0=[${pop}]&vac_type=[${vac_type}]&fn0=[${fn0}]&Kmatval=[${cellValues}]&H=[${ve}]&vac_avail=[${vac_avail}]&model_sub_type=${model}`;
    console.log(apiURL);
    axios
      .get(apiURL)
      .then((response) => {
        this.setState({
          results: response.data.result
        })
        console.log(response.data)
        if (response.data.status === false) {
          Toast.fail(response.data.errors[0])
        } else {
          // alert(response.data.result[1])
          // const res = response.data.result[2][0];
          this.setState({ results: [response.data.result[0], response.data.result[1]] });
          const res = response.data.result[2];
          const groups = this.state.groups;
          const resultsGrid = this.state.resultsGrid;

          const chartData = [
            ['Population Groups', ...this.state.vaccines.map(vac => vac.name)],
          ];

          for (var j = 0; j < groups.length; j++) {
            let results = [];
            for (var i = 0; i < this.state.vaccines.length; i++) {
              results.push(res[i][j])
              resultsGrid[i][j].result = res[i][j];
            }
            chartData.push([groups[j].name, ...results])
          }

          this.setState({ groups, resultsGrid, chartData }, () => {
            Toast.success('Done optimizing!', 250)
          });
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.target.name === 'groupName') {
      this.addGroup()
    }
    if (event.key === 'Enter') {
      this.addVaccine()
    }
  }

  // change current model
  handleModelChange = (event) => {
    this.setState({
      model: event.target.value
    })
  }

  // adding new vaccine, updating state for vaccines array
  addVaccine() {
    let name = this.state.vaccineName
    if (name.trim() === "") return

    let newResultsGrid = this.state.resultsGrid;
    while (newResultsGrid.length !== this.state.vaccines.length + 1) {
      newResultsGrid.push(
        Array.apply(null, Array(this.state.groups.length)).map(function () { return { result: '--' } })
      )
    }
    this.setState(prevState => ({
      vaccineName: "",
      vaccines: [...prevState.vaccines, {
        name,
        efficacy: 50,
        doses: 100
      }],
      resultsGrid: newResultsGrid
    }))
  }

  // for removing vaccines
  removeVaccine = name => () => {
    let vName = name;
    let vacsClone = JSON.parse(JSON.stringify(this.state)).vaccines
    let index = -1
    vacsClone.find(function (item, i) {
      if (item.name === vName) {
        index = i
        return i
      }
      return 0
    });
    vacsClone.splice(index, 1);
    this.setState(prevState => ({
      vaccines: vacsClone,
    }))
  }

  // for saving values as json
  save = () => {
    const vaccines = this.state.vaccines.map(vac => ({
      vaccineName: vac.name,
      vaccineEfficacy: vac.efficacy,
      vaccineDoses: vac.doses
    }))
    const groups = this.state.groups.map(group => ({
      population: group.population,
      groupName: group.name,
    }))
    const grid = this.state.grid.map((row) => {
      let values = {};
      this.state.groups.forEach((grp, index) => {
        values[grp.name] = row[index].value
      })
      return values
    })
    // const data = [...vaccines, ...groups, ...grid];
    const data = [];
    let cur = 0;
    while (vaccines.length > cur || groups.length > cur || grid.length > cur) {
      data.push({
        vaccineName: vaccines[cur]?.vaccineName,
        vaccineEfficacy: vaccines[cur]?.vaccineEfficacy,
        vaccineDoses: vaccines[cur]?.vaccineDoses,
        population: groups[cur]?.population,
        groupName: groups[cur]?.groupName,
        ...grid[cur]
      })
      cur++;
    }
    const fileName = "covidallocapp-" + Date.now();
    const exportType = "csv";
    exportFromJSON({
      data,
      fileName,
      exportType,
    });
  }

  // for loading values from json
  load = (result) => {
    var data = result.data;
    let groups = [];
    let vaccines = [];
    data.forEach((entry) => {
      if (entry.groupName !== "") {
        groups.push({
          name: entry.groupName,
          population: entry.population,
          result: "--"
        });
      }

      if (entry.vaccineName !== "") {
        vaccines.push({
          doses: entry.vaccineDoses,
          efficacy: entry.vaccineEfficacy,
          name: entry.vaccineName
        });
      }
    })

    let gridValues = [];
    data.forEach((entry) => {
      let gridRow = []
      groups.forEach((group) => {
        if (entry[group.name] !== "") {
          gridRow.push(entry[group.name]);
        }
      })
      gridValues.push(gridRow);
    })

    const resultsArray = Array(vaccines.length).fill().map(() => Array(groups.length).fill('--'))

    this.checkEmpty(groups,vaccines,gridValues);

    const resultsGrid = resultsArray.map((arr) => {
      return arr.map((val) => ({ result: val }))
    })

    const grid = gridValues.map((arr) => {
      return arr.map((val) => ({ value: val }))
    })



    this.setState({
      groups,
      grid,
      resultsGrid,
      vaccines
    })
  }

  checkEmpty(groups, vaccines, gridValues){
    const emptyField = (obj) => {
      let empty = false;
      Object.keys(obj).forEach(function (prop) {
        if (obj[prop] === "") empty =true;
      })
      return empty;
    };
    const emptyFieldArr = (arr) => {
      for (var i =0;i<arr.length;i++) {
        if (arr[i] === null || arr[i] === "") return true;
      }
      return false;
    };
    
    if (groups.some(emptyField) || vaccines.some(emptyField) || gridValues.some(emptyFieldArr)) {
      if (window.confirm("Missing values found for some fields. Insert default values?")) {
        let num = 1;
        groups.forEach(group => {
          group.name = group.name === '' ? 'G'+num : group.name;
          num++;
          group.population = group.population === '' ? 100 : group.population;
        })

        let vnum = 1;
        vaccines.forEach(vaccine => {
          vaccine.doses = vaccine.doses === "" ? 100 : vaccine.doses;
          vaccine.efficacy = vaccine.efficacy === '' ? 80 : vaccine.efficacy;
          vaccine.name = vaccine.name === '' ? 'Vaccine ' + vnum : vaccine.name;
          vnum++;
        })

        gridValues.forEach(row => {
          for (var i =0;i<row.length;i++) {
            if (row[i] === "") row[i] = "0.01";
          }
        })
      } 
    }
  }

  checkValues(){
    if (this.state.groups.length === 0) {
      Toast.info("Groups cannot be empty", 250)
      return false
    }

    if (this.state.vaccines.length === 0) {
      Toast.info("Vaccines cannot be empty", 250)
      return false
    }

    const emptyField = (obj) => {
      let empty = false;
      Object.keys(obj).forEach(function (prop) {
        if (obj[prop] === "") empty =true;
      })
      return empty;
    };

    // const emptyFieldArr = (arr) => {
    //   for (var i =0;i<arr.length;i++) {
    //     if (arr[i] === null || arr[i] === "") return true;
    //   }
    //   return false;
    // };
    
    if (this.state.groups.some(emptyField)) {
      Toast.info("Group population cannot be empty", 250)
      return false
    }

    if (this.state.vaccines.some(emptyField)) {
      Toast.info("Vaccine doses cannot be empty", 250)
      return false
    }

    return true;
  }
  
  async loadTestCase(){
    const response = await fetch('predefined/'+this.state.testCase+'.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = await decoder.decode(result.value);
    Papa.parse(csv, {
      complete: this.load,
      header: true
    });
  }

  handleSliderChange = (event, newValue, name) => {
    let vacsClone = JSON.parse(JSON.stringify(this.state)).vaccines
    let index = -1
    const vaccine = vacsClone.find((item, i) => {
      if (item.name === name) {
        index = i
        return item;
      }
      return 0
    });
    vaccine.efficacy = newValue;
    vacsClone[index] = vaccine;
    this.setState(prevState => ({
      vaccines: vacsClone,
    }))
  };

  handleFileChange = event => {
    const csvfile = event.target.files[0];
    console.log(csvfile)
    Papa.parse(csvfile, {
      complete: this.load,
      header: true
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.mainForm}>
        <Container className={classes.modelContainer}>
          {/* <h1>COVID Vaccine Allocation Model</h1> */}
          <FormControl component="fieldset">
            {/* <FormLabel component="legend">Model</FormLabel> */}
            <h2>Select a model</h2>
            <RadioGroup row>
              <FormControlLabel
                control={<Radio color="primary" />}
                checked={this.state.model === 'minV'}
                onChange={this.handleModelChange}
                value="minV"
                label="Minimize Vaccines Required"
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                checked={this.state.model === 'minR'}
                onChange={this.handleModelChange}
                value="minR"
                label="Minimize Reproductive Rate"
              />
            </RadioGroup>
            {this.state.model === 'minV' &&
              (<p>The <b>Minimize Vaccines Required (MinV)</b> model will solve the minimum vaccines needed to stop the spread of COVID-19 in a region (i.e. R&lt;1).
              Input the population group name and size for each group, the vaccine efficacy (in percent), and the contact rates per group.
              </p>)
            }
            {this.state.model === 'minR' &&
              (<p>The <b>Minimize Reproductive Rate (MinR)</b> model will solve the vaccine allocation to minimize the spread of COVID-19, indicated by the reproductive rate, R,  in a given region. Reproductive rate is the measure of the spread of the COVID-19.
              Input the population group name and size for each group, the vaccine efficacy (in percent), and the contact rates per group.
              </p>)
            }

          </FormControl>
          {this.state.testCaseOptions.length !== 0 &&
          <Box mt={2} mb={2}>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            name="testCase"
            value={this.state.testCase}
            onChange={this.handleChange.bind(this)}
            style={{ marginRight: 10 }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {this.state.testCaseOptions.map((tc) =>
              <MenuItem key={tc} value={tc}>{tc}</MenuItem>
            )}
          </Select>
          <Button disabled={this.state.testCase===''} size="large" variant="contained" onClick={this.loadTestCase} color="primary">
            Load Test Case
                  </Button>
        </Box>
          }
          
        </Container>
        <Container>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} sm={4}>

              {true &&
                <div>
                  <h2>Vaccine Efficacy and Availability</h2>
                  <TextField
                    fullWidth
                    label="Vaccine Name"
                    name='vaccineName'
                    value={this.state.vaccineName}
                    onChange={this.handleChange.bind(this)}
                    variant="outlined"
                    onKeyPress={this.handleKeyPress}
                    InputProps={{ endAdornment: <Button onClick={this.addVaccine}>Add</Button> }}
                  />
                  {/* Vaccine efficacy input */}
                  {this.state.vaccines.map((vaccine) =>
                    <Box align="center" mt={2} key={vaccine.name}>
                      <Grid container spacing={2} alignItems="flex-end">
                        <Grid item xs={4} md={3}>
                          <TextField
                            fullWidth
                            label={'Vaccine'}
                            defaultValue={vaccine.name}
                            name={vaccine.name}
                            onChange={this.handleNameChange.bind(this)}
                          />
                        </Grid>
                        <Grid item xs={8} md={5}>
                          <Slider
                            value={vaccine.efficacy}
                            onChange={(e, v) => this.handleSliderChange(e, v, vaccine.name)}
                            aria-labelledby="input-slider"
                            name="ve"
                            step={1}
                            min={0}
                            max={100}
                            label="Standard"
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <Input
                            className={classes.input}
                            value={vaccine.efficacy || 0}
                            margin="dense"
                            onChange={this.handleEfficacyChange.bind(this)}
                            // value={this.state.ve}
                            label={'Efficacy'}
                            // margin="dense"
                            // onChange={this.handleChange.bind(this)}
                            // onBlur={handleBlur}
                            endAdornment={<b>%</b>}
                            inputProps={{
                              step: 1,
                              min: 0,
                              max: 100,
                              type: 'number',
                              'aria-labelledby': 'input-slider',
                              label: 'Efficacy'
                            }}
                            name={vaccine.name}
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <TextField
                            fullWidth
                            label={'Available'}
                            value={vaccine.doses}
                            onChange={this.handleDoseChange.bind(this)}
                            name={vaccine.name}
                            inputProps={{
                              min: 0,
                              type: 'number',
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </div>
              }

              {/* Population Group text input */}
              <Box mt={4}>

                <h2>Population Groups</h2>
                {/* <form noValidate autoComplete="off"> */}
                <TextField
                  fullWidth
                  label="Group Name"
                  name='groupName'
                  value={this.state.groupName}
                  onChange={this.handleChange.bind(this)}
                  variant="outlined"
                  onKeyPress={this.handleKeyPress}
                  InputProps={{ endAdornment: <Button onClick={this.addGroup}>Add</Button> }}
                />
                {/* </form> */}
              </Box>

              {/* Population size input for every group */}
              {this.state.groups.map((group) =>
                <Box mt={2} key={group.name}>
                  <TextField
                    fullWidth
                    // label={group.name}
                    value={group.population}
                    onChange={this.handlePopulationChange.bind(this)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{group.name}:</InputAdornment>,
                      endAdornment: <Icon onClick={this.removeGroup(group.name)} className={classes.closeBtn}>close</Icon>
                    }}
                    name={group.name}
                  />
                </Box>
              )}
            </Grid>

            {/* Right Column */}
            <Grid item sm={8} xs={12} className={classes.rightColumn}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <h2>Contact Rates</h2>
                </Grid>
                {/* Allocate button */}
                <Grid item sm={8} xs={12}>
                  <Box mt={2}>
                    <Button size="large" startIcon={<PlayArrowIcon />} disabled={this.state.grid.length === 0} onClick={this.allocate} className={classes.allocateBtn} variant="contained" color="primary">
                      Allocate
                    </Button>
                    <Button size="large" startIcon={<SaveIcon />} disabled={this.state.grid.length === 0} onClick={this.save} className={classes.allocateBtn} variant="outlined" color="primary">
                      Save Values
                    </Button>
                    <Button size="large" component="label" startIcon={<ComputerIcon />} className={classes.allocateBtn} variant="outlined" color="primary">
                      Load Values
            <input
                        type="file"
                        accept=".csv"
                        hidden
                        onChange={this.handleFileChange}
                      />
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Contact rates data sheet */}
              {this.state.grid.length === 0 && (

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box mt={4}>
                      <Chip label="No Groups Added" variant="outlined" />
                    </Box>
                  </Grid>
                </Grid>
              )}
              {this.state.grid.length > 0 && (
                <ReactDataSheet
                  data={this.state.grid}
                  colSpan={1}
                  rowSpan={1}
                  valueRenderer={cell => cell.value}
                  sheetRenderer={props => (
                    <table className={props.className + ' my-awesome-extra-class'}>
                      <thead>
                        <tr>
                          <th className='action-cell' />
                          {this.state.groups.map((group) => (<th key={group.name}>{group.name}</th>))}
                        </tr>
                      </thead>
                      <tbody className={classes.table}>
                        {props.children}
                      </tbody>
                    </table>
                  )}
                  rowRenderer={props => (
                    <tr>
                      <td className='read-only'>
                        <span className="value-viewer">{this.state.groups[props.row] ? this.state.groups[props.row].name : null}</span>
                      </td>
                      {props.children}

                    </tr>
                  )}
                  onCellsChanged={changes => {
                    const grid = this.state.grid.map(row => [...row]);
                    changes.forEach(({ cell, row, col, value }) => {
                      grid[row][col] = { ...grid[row][col], value };
                    });
                    this.setState({ grid });
                  }}
                />
              )}
              {/* {
                this.state.groups.length > 0 &&
                <div className={classes.resultContainer}>
                  <h2>Results</h2>
                  {this.state.groups.map((group) =>
                    <div key={group.name} className={classes.result}>
                      <Typography variant="body1" >Allocation for Group {group.name}: <b>{group.result}</b></Typography>
                    </div>
                  )}
                </div>
              } */}
              {
                this.state.groups.length > 0 &&
                <div className={classes.resultContainer}>
                  <h2>Results</h2>
                  <ReactDataSheet
                    data={this.state.resultsGrid}
                    colSpan={1}
                    rowSpan={1}
                    readOnly={true}
                    valueRenderer={cell => cell.result}
                    sheetRenderer={props => (
                      <table className={props.className + ' my-awesome-extra-class'}>
                        <thead>
                          <tr>
                            <th className='action-cell' />
                            {this.state.groups.map((group) => (<th key={group.name}>{group.name}</th>))}
                          </tr>
                        </thead>
                        <tbody className={classes.table}>
                          {props.children}
                        </tbody>
                      </table>
                    )}
                    rowRenderer={props => (
                      <tr>
                        <td className='read-only'>
                          <span className="value-viewer">{this.state.vaccines[props.row] ? this.state.vaccines[props.row].name : null}</span>
                        </td>
                        {props.children}

                      </tr>
                    )}
                  />

                  {
                    this.state.results?.length > 0 &&
                    <div className={classes.resultContainer}>
                      <div className={classes.result}>
                        <Typography variant="body1" >Reproductive Number: <b>{this.state.results[0]}</b></Typography>
                      </div>
                      <div className={classes.result}>
                        <Typography variant="body1" >Total Vaccines{this.state.model === 'minV' ? ' Required' : ''}: <b>{this.state.results[1]}</b></Typography>
                      </div>
                    </div>
                  }
                </div>
              }
            </Grid>



            {
              this.state.chartData.length > 0 &&
              <Grid item xs={12} sm={12}>
                <Chart

                  chartType="ColumnChart"
                  loader={<div>Loading Chart</div>}
                  data={this.state.chartData}
                  options={{
                    isStacked: true,
                    title: 'Vaccine Allocation per Population Group',
                    chartArea: { width: '70%' },
                    hAxis: {
                      title: 'Population Groups',
                      minValue: 0,
                    },
                    vAxis: {
                      title: 'Dosage Allocation',
                    },
                  }}
                  legendToggle
                />
              </Grid>
            }
          </Grid>
        </Container>
      </div>
    );
  }
}

MainForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainForm);