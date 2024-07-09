<template>
    <div class="container mt-5">
      <h1>Portfolio Builder</h1>
      <form @submit.prevent="addStock">
        <div class="form-group">
          <label for="stock">Select Stock:</label>
          <select v-model="newStock" class="form-control" required>
            <option v-for="stock in EGXTickerList" :key="stock" :value="stock">
              {{ stock }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="unit">Number of Stocks:</label>
          <input type="number" v-model="newUnits" class="form-control" min="1" max="100000" required />
        </div>
        <button type="submit" class="btn btn-primary mt-3">Add Stock</button>
      </form>
      <div v-if="portfolio.length > 0" class="mt-5">
        <h2>Your Portfolio</h2>
        <ul class="list-group">
          <li v-for="(stock, index) in portfolio" :key="index" class="list-group-item">
            {{ stock.name }}: {{ stock.unit }} stocks
            <button @click="removeStock(index)" class="btn btn-danger btn-sm float-right">Remove</button>
          </li>
        </ul>
      </div>
      <button v-if="portfolio.length > 0" @click="saveToUserAccount(portfolio)" class="btn btn-success mt-3">Save Portfolio</button>
      <button v-if="portfolio.length > 0" @click="decodePortfolio(this.portfolioString)" class="btn btn-success mt-3">Print Portfolio</button>

    </div>
  </template>
  
  <script>
import CryptoJS from 'crypto-js';// remove and uninstall this and Hashing after compression of portfolio done 
import { db } from "/src/firebase/init";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

  export default {
    data() {
      return {
        availableStocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'], // Example stocks
        EGXTickerList:["AALR","ABUK","ACAMD","ACAP","ACGC","ACRO","ADCI","ADIB","ADPC","ADRI","AFDI","AFMC","AIFI","AIH","AJWA","ALCN",
      "ALUM","AMER","AMES","AMIA","AMOC","AMPI","ANFI","APSW","ARAB","ARCC","AREH","ARPI","ARVA","ASCM","ASPI","ATLC","ATQA","AXPH",
      "BIDI","BIGP","BINV","BIOC","BTFH","CAED","CANA","CCAP","CCRS","CEFM","CERA","CFGH","CICH","CIEB","CIRA","CLHO","CNFN","COMI",
      "COPR","COSG","CPCI","CSAG","CTSB","DAPH","DEIN","DGTZ","DOMT","DSCW","DTPP","EALR","EASB","EAST","EBSC","ECAP","EDBM","EDFM",
      "EEII","EFIC","EFID","EFIH","EGAL","EGAS","EGBE","EGCH","EGREF","EGSA","EGTS","EHDR","EIUD","EKHO","EKHOA","ELEC","ELKA","ELNA",
      "ELSH","ELWA","EMFD","ENGC","EOSB","EPCO","EPPK","ESRS","ETEL","ETRS","EXPA","FAIT","FAITA","FERC","FIRE","FNAR","FTNS","FWRY",
      "GBCO","GDWA","GGCC","GIHD","GMCI","GOCO","GRCA","GSSC","GTWL","HDBK","HELI","HRHO","IBCT","ICFC","ICID","ICLE","ICMI","IDHC",
      "IDRE","IEEC","IFAP","INEG","INFI","IRON","ISMA","ISMQ","ISPH","JUFO","KABO","KRDI","KWIN","KZPC","LCSW","LUTS","MAAL","MASR",
      "MBSC","MCQE","MCRO","MENA","MEPA","MFPC","MFSC","MHOT","MICH","MILS","MIPH","MISR","MKIT","MMAT","MOED","MOIL","MOIN","MOSC",
      "MPCI","MPCO","MPRC","MTIE","NAHO","NCCW","NDRL","NEDA","NHPS","NINH","NIPH","OBRI","OCDI","OCPH","ODIN","OFH","OIH","OLFI",
      "ORAS","ORHD","ORWE","PHAR","PHDC","PHTV","POUL","PRCL","PRDC","PRMH","QNBE","RACC","RAKT","RAYA","REAC","RKAZ","RMDA","ROTO","RREI",
      "RTVC","RUBX","SAIB","SAUD","SCEM","SCFM","SCTS","SDTI","SEIG","SIPC","SKPC","SMFR","SNFC","SPIN","SPMD","SUGR","SVCE","SWDY","TALM",
      "TANM","TAQA","TMGH","TRTO","UASG","UEFM","UEGC","UNIP","UNIT","UPMS","UTOP","VERT","WCDF","WKOL","ZEOT","ZMID",
      "EGX30","EGX70","EGX100","EGX30Cap","TAMAYOUZ", "AZ-GOLD","AZ-HALAN","AZ-MENTH", "AZ-OP","AZ-SAVE", "AZ-VALU","AZ-Maashy","AZ-Nasr", 
      "CI30", "B Secure","Mid-market EGGOLD", "Misr Takaful Fund"],
        newStock: '',
        newUnits: '',
        portfolio: [],
        portfolioString: '',
        portfolioHash: '',
      };
    },
    methods: {
      addStock() {
        if (this.newStock && this.newUnits) {
          // Check if the stock is already in the portfolio
          if (this.portfolio.some(stock => stock.name === this.newStock)) {
            alert('Stock already in portfolio.');
          } else {
            this.portfolio.push({              
              name: this.newStock,
              unit: this.newUnits,
            });
            // Reset input fields
            this.newStock = '';
            this.newUnits = '';
          }
        }
      },
      removeStock(index) {
        this.portfolio.splice(index, 1);
      },
    portfolioToString(portfolio) {
      return portfolio
        .map(stock => `${stock.name}:${stock.unit}`)
        .join(';');
/*       const entries = (Object.entries(portfolio));
      entries.sort(([a], [b]) => a.localeCompare(b));      
      return entries.map(([stock, unit]) => `${stock}:${unit}`).join(';'); */

      },
    encodePortfolio(portfolio) {
      const str = this.portfolioToString(portfolio);      
      this.portfolioString = str;
      console.log("portfolio string: ", this.portfolioString);
      const hash = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
      this.portfolioHash = hash;
      console.log("portfolio hash", this.portfolioHash)
      //return { encoded: str, hash: hash };
      },

    decodePortfolio(encodedStr) {
      console.log("encodedStr: ", encodedStr)
      const entries = encodedStr.split(';').map(entry => entry.split(':'));
      const portfolio = {};
      for (const [stock, percentage] of entries) {
          portfolio[stock] = parseInt(percentage);
      }
      console.log("decoded portfolio: ", portfolio)
      return portfolio;
},
async saveToUserAccount(portfolio) {     
        const auth = getAuth();
        const user = auth.currentUser;
        this.encodePortfolio(portfolio);
        if (user) {
          const uid = user.uid;
          try {
            await setDoc(doc(db, 'users', uid), { portfolio: this.portfolioHash }, { merge: true });
            console.log('Portfolio saved to user account');
          } catch (error) {
            console.error('Error saving portfolio to user account: ', error);
          }
        } else {
          console.error('User is not logged in');
        }
    },

    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
  }
  </style>