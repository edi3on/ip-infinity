# fast api babyyy

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List
from datetime import datetime
import json
import os
import requests
import time
import uvicorn
from operator import itemgetter
ALCHEMY_API_KEY = ''

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/v1/getnfts/{address}")
def get_nfts(address: str):
    url = f"https://eth-mainnet.g.alchemy.com/nft/v3/{ALCHEMY_API_KEY}/getNFTsForOwner?owner={address}&withMetadata=true&pageSize=100"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

@app.get("/v2/getnfts/{address}")
def get_nfts(address: str):
    url = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}/getNFTs/?owner={address}&excludeFilters[]=SPAM"
    response = requests.get(url)
    filtered_response = []
    for nft in response.json()['ownedNfts']:
        filtered_response.append({
            "contractMetadata": nft["contractMetadata"],
            "metadata": nft.get("metadata", {})
        })
    
                

    return filtered_response


@app.get("/v3/getnfts/{address}")
def get_nfts(address: str):
    url = f"https://eth-mainnet.g.alchemy.com/nft/v3/{ALCHEMY_API_KEY}/getNFTsForOwner?owner={address}&withMetadata=true&pageSize=100"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching NFTs: {str(e)}")

    nfts_with_prices = []
    for nft in response.json().get('ownedNfts', []):
        floor_price = nft.get("contract", {}).get("openSeaMetadata", {}).get("floorPrice", 0)
        
        if floor_price is not None:
            nfts_with_prices.append({
                "contract": nft.get("contract", {}),
                "tokenId": nft.get("tokenId", {}),
                "image": nft.get("image", {}),
                "floor_price": floor_price
            })

    # Sort NFTs by floor price in descending order and get top 5
    top_5_nfts = sorted(nfts_with_prices, key=itemgetter('floor_price'), reverse=True)[:5] #change to whatever number you need

    #get rarity
    for nft in top_5_nfts:
        contract_address = nft["contract"]["address"]
        token_id = nft["tokenId"]
        try: 
            rarity = requests.get(f"https://eth-mainnet.g.alchemy.com/nft/v3/{ALCHEMY_API_KEY}/computeRarity?contractAddress={contract_address}&tokenId={token_id}")
            print(rarity.json())
            nft["rarity"] = rarity.json()
        except requests.RequestException as e:
            print(f"Error fetching rarity for {contract_address}, token {token_id}: {str(e)}")
            nft["rarity"] = {}
        time.sleep(2)
    
    return top_5_nfts
    
   



    


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
