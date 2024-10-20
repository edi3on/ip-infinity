# How to run
- Clone the repository
- Install all required libraries
- Get a [Groq](https://console.groq.com/login) key for llama-3.2-11b-vision-preview and set key variable to it
- Get an [Alchemy](https://www.alchemy.com/) key and set ALCHEMY_API_KEY to it
- Create a [HuggingFace](https://huggingface.co/) account and [log into it in your terminal](https://huggingface.co/docs/huggingface_hub/en/guides/clihttps://huggingface.co/docs/huggingface_hub/en/guides/cli)
- Run the program
- Go to https://[domain you set].com/v4/getnfts/[ENS]
## How it works
- a simple fastAPI server is started with an endpoint a user can call with an ENS
- once the ENS is submitted Alchemy API is used to get all owned NFTs
- we then sort through the top five nfts in floor price (you can increase but this is for testing), then we use Alchemy again to get rarities.  
- Once we get the top five NFTs with metadata, it gets run through the function processJson (the ai)
- Each image gets a generated text description from Meta's Llama 3.2 Vision model
- The text descriptions are then sorted into a category by zero-shot classification model (DeBERTa)
- Each NFT gets stats relevant to its category based on the collection floor price and the rarity of the NFTs traits
- This data is then dumped into a new .json file.
