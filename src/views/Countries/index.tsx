import { Dispatch, useEffect, useMemo, useState } from 'react';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Input from '../../components/Input';
import './style.css';
import '../../../src/components/Button/logout.css'
import Select, { ISelectOption } from '../../components/Select';
import CountryCard from '../../components/CountryCard';
import ICountry from '../../interfaces/ICountry';
import ClientAPI from '../../utils/client.api';
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/type';
import { useNavigate } from 'react-router-dom';
import { updateSeasonAndCountry } from '../../store/actions';

let timer: any;
export default function Countries() {
  const apiKey: string = useSelector((state: AppState) => state.key);
  const navigate = useNavigate();
  const dispatch: Dispatch<any> = useDispatch();

  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("");
  const [seasons, setSeasons] = useState<number[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [loading, setLoading] = useState(true);
  const optionsSeason = useMemo<ISelectOption[]>(() => {
    return seasons.map((element) => { return { name: element.toString(), value: element.toString() } });
  }, [seasons]);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(handleSearch, 500)

    return () => {
      clearTimeout(timer);
    }
  }, [search]);

  useEffect(() => {
    if (!apiKey) {
      navigate('/');
    } else {
      getCountries();
    }
  }, []);

  const getCountries = async () => {
    setLoading(true);
    try {
      const client = new ClientAPI(apiKey);
      const result = await client.getCountries();
      const seasons = await client.getSeasons();
      setSeasons(seasons);
      const date = new Date();
      if (seasons.find((element) => element == date.getFullYear())) {
        setSeason(date.getFullYear().toString());
      }
      setCountries(result);
    } catch (e) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  const handleClickCountry = (country: ICountry) => {
    dispatch(updateSeasonAndCountry(country, parseInt(season)));
    navigate('/leagues');
  }

  const handleClickLogout = () => {
    navigate('/');
  }

  const handleSearch = async () => {
    setLoading(true);
    try {
      const client = new ClientAPI(apiKey);
      const result = await client.searchCountry(search);
      setCountries(result);
    } catch (e) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <section className="countries-area">
        <div className="header">
          <Input label='Digite o nome do País' dominant value={search} onChange={(value) => setSearch(value)} />
          <Select dominant value={season}
            options={optionsSeason}
            onChange={(value) => setSeason(value)} />
          <Button>
            Pesquisar
          </Button>

          <button className="button" onClick={handleClickLogout} >
            Voltar
          </button>
        </div>

        <h1 className="title">---- Países ----</h1>
        {
          loading ?
            <Loading /> :
            <div className="content">
              {countries.map((country, index) => (
                <CountryCard key={index} country={country} onClick={() => handleClickCountry(country)} />
              ))}
            </div>
        }


      </section>
    </Container>
  );
}