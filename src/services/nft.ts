import axios from "axios";

const baseUrl = "https://randomwalknft-api.com/";

class NFTService {
  public async create(token_id: number) {
    await axios.post(baseUrl + "tokens", { token_id });
  }
}

export default new NFTService();