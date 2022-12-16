import { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { useStyles } from '../hooks';
import axios from '../api';
import { useScoreCard } from '../hooks/useScoreCard';
import Table from './Table';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;

const StyledFormControl = styled(FormControl)`
  min-width: 120px;
`;

const ContentPaper = styled(Paper)`
  height: 40px;
  padding: 2em;
  overflow: auto;
`;

const QueryPanel = () => {
  const classes = useStyles();

  const { messages, addRegularMessage, addErrorMessage } =
    useScoreCard();

  const [queryType, setQueryType] = useState('name');
  const [queryString, setQueryString] = useState('');
  const [dataTable, setDataTable] = useState([]);

  const handleChange = (func) => (event) => {
    func(event.target.value);
  };

  const handleQuery = async () => {
    const {
      data: { messages, message },
    } = await axios.get('/cards', {
      params: {
        type: queryType,
        queryString,
      },
    });

    if (!messages) addErrorMessage(message);
    else showTable();
  };

  const showTable = async () => {
    const {
      data: { messages, message },
    } = await axios.get('/cardTable', {
      params: {
        type: queryType,
        queryString,
      },
    });

    if (!messages) setDataTable([]);
    else {
      setDataTable(messages);
    };
  };

  return (
    <Wrapper>
      <Row>
        <StyledFormControl>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={queryType}
              onChange={handleChange(setQueryType)}
            >
              <FormControlLabel
                value="name"
                control={<Radio color="primary" />}
                label="Name"
              />
              <FormControlLabel
                value="subject"
                control={<Radio color="primary" />}
                label="Subject"
              />
            </RadioGroup>
          </FormControl>
        </StyledFormControl>
        <TextField
          placeholder="Query string..."
          value={queryString}
          onChange={handleChange(setQueryString)}
          style={{ flex: 1 }}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={!queryString}
          onClick={handleQuery}
        >
          Query
        </Button>
      </Row>
      <ContentPaper variant="outlined">
        {messages.map((m, i) => (
          <Typography variant="body2" key={m + i} style={{ color: m.color }}>
            {m.message}
          </Typography>
        ))}
      </ContentPaper>
      <Table rows={dataTable} />
    </Wrapper>
  );
};

export default QueryPanel;
