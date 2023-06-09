import axios, { AxiosError, AxiosInstance } from "axios";
import ICountry from "../interfaces/ICountry";
import ILeague from "../interfaces/ILeague";
import ILeagueResponse from "../interfaces/response/ILeagueResponse";
import ITeamResponse from "../interfaces/response/ITeamResponse";
import ITeam from "../interfaces/ITeam";
import IPlayerResponse from "../interfaces/response/IPlayerResponse";
import IPlayer from "../interfaces/IPlayer";
import IStatistics from "../interfaces/IStatistics";

export default class ClientAPI {
    private client: AxiosInstance;

    constructor(key:string){
        this.client = axios.create({
            baseURL: 'https://v3.football.api-sports.io/',
            headers: {
                'x-apisports-key': key,
            }
        })
    } 

    public async checkKey() : Promise<boolean> {
        try {
            await this.client.get('timezone');
            return true;
        }catch(e){
            if(e instanceof AxiosError){
                if(e.response?.status == 401 || e.response?.status == 403) return false;
            }
            throw new DOMException("Failed server");
        }
    }

    public async getCountries() : Promise<ICountry[]>{
        try {
            const result = await this.client.get('countries');
            return result.data.response;
        }catch(e){
            throw new DOMException("Failed server");
        }
    }

    public async searchCountry(search: string) : Promise<ICountry[]>{
        try {
            const result = await this.client.get(`countries?search=${search}`);
            return result.data.response;
        }catch(e){
            throw new DOMException("Failed server");
        }
    }

    public async getSeasons() : Promise<number[]>{
        try {
            const result = await this.client.get('leagues/seasons');
            return result.data.response;
        }catch(e){
            throw new DOMException("Failed server");
        }
    }

    public async getLeagues(country: ICountry, season: number) : Promise<ILeague[]>{
        try {
            const result = await this.client.get(`leagues?code=${country.code}&season=${season}`);
            const leagues: ILeague[] = [];
            (result.data.response as ILeagueResponse[]).forEach((element)=>{
                leagues.push(element.league);
            });
            return leagues;
        }catch(e){
            throw new DOMException("Failed server");
        }
    }

    public async searchLeague(country: ICountry, season: number, search: string) : Promise<ILeague[]>{
        try {
            const result = await this.client.get(`leagues?code=${country.code}&season=${season}&search=${search}`);
            const leagues: ILeague[] = [];
            (result.data.response as ILeagueResponse[]).forEach((element)=>{
                leagues.push(element.league);
            });
            return leagues;
        }catch(e){
            throw new DOMException("Failed server");
        }
    }

    public async getTeams(league: ILeague, season: number) : Promise<ITeam[]>{
        try {
            const result = await this.client.get(`teams?league=${league.id}&season=${season}`);
            const teams: ITeam[] = [];
            (result.data.response as ITeamResponse[]).forEach((element)=>{
                teams.push(element.team);
            });
            return teams;
        }catch(e){
            throw new DOMException("Failed server");
        }
    }

    public async getPlayers(team: ITeam, season: number) : Promise<IPlayer[]>{
        try {
            const result = await this.client.get(`players?team=${team.id}&season=${season}`);
            const players: IPlayer[] = [];
            (result.data.response as IPlayerResponse[]).forEach((element)=>{
                players.push(element.player);
            });
            return players;
        }catch(e){
            throw new DOMException("Failed server");
        }
    }

    public async getStatistics(league: number, team: number, season: number) : Promise<IStatistics>{
        try {
            const result = await this.client.get(`teams/statistics?league=${league}&team=${team}&season=${season}`);
            const statistics: IStatistics = {
                ...result.data.response,
                minuteGoals: []
            }
            Object.keys(result.data.response.goals.for.minute).forEach((element)=>{
                statistics.minuteGoals.push({
                    minute: element,
                    percentage: result.data.response.goals.for.minute[element].percentage,
                    total: result.data.response.goals.for.minute[element].total,
                });
            });
            return statistics as IStatistics;
        }catch(e){
            console.log(e);
            throw new DOMException("Failed server");
        }
    }
}
