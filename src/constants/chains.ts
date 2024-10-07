import { Hex } from "viem";

export type WrappedToken = {
  name: string;
  /** 2-6 characters long */
  symbol: string;
  decimals: number;
  address: Hex;
};

type Chain = {
  description?: string;
  logoUrl?: string;
  website?: string;
  wrappedToken?: WrappedToken;
};

const chains: Record<number, Chain> = {
  // OP
  10: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_optimism.png",
    description:
      "Optimism is a collective focused on building scalable, decentralized infrastructure for Ethereum. It supports a network of blockchain ecosystems powered by the OP Stack, promoting public goods funding, equitable governance, and sustainable growth.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
  },
  // Rootstock
  30: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_rootstock.jpg",
    description:
      "Rootstock (RSK) is a Bitcoin sidechain that enables Ethereum-compatible smart contracts while leveraging Bitcoin's security through merged mining. It powers decentralized finance (DeFi) and enables Bitcoin-based decentralized applications (dApps).",
    wrappedToken: {
      name: "Wrapped BTC ",
      symbol: "WBTC",
      decimals: 18,
      address: "0x542fda317318ebf1d3deaf76e0b632741a7e677d",
    },
  },
  // BSC
  56: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_bsc.jpg",
    description:
      "BNB Chain is a blockchain platform designed for developers and users focused on decentralized applications (dApps) and decentralized finance (DeFi).",
    wrappedToken: {
      name: "Wrapped BNB",
      symbol: "WBNB",
      decimals: 18,
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
  },
  // Gnosis
  100: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/agg_icons/gnosis.png",
    description:
      "Gnosis Chain is an Ethereum-compatible blockchain known for its low fees (paid in xDAI) and fast transactions. It’s community-owned, governed by GnosisDAO, and secured by over 200,000 validators worldwide. Designed as a more efficient environment for decentralized applications (dApps), Gnosis Chain emphasizes resilience, neutrality, and developer experimentation",
    wrappedToken: {
      name: "Wrapped XDAI",
      symbol: "WXDAI",
      decimals: 18,
      address: "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d",
    },
  },
  // Fuse
  122: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/agg_icons/fuse.png",
    description:
      "Fuse is a decentralized blockchain platform designed to power cost-effective payments and DeFi solutions. It supports EVM-compatible dApps, business payments, and loyalty programs, with tools for Web3 integration, mobile wallets, and branded stablecoins.",
    wrappedToken: {
      name: "Wrapped Fuse",
      symbol: "WFUSE",
      decimals: 18,
      address: "0x0BE9e53fd7EDaC9F859882AfdDa116645287C629",
    },
  },
  // Polygon
  137: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_polygon.jpg",
    description:
      "Polygon is a leading Ethereum scaling platform that offers a suite of solutions, including its PoS chain, zkEVM, and more, designed to enhance scalability, security, and decentralization for dApps.",
    wrappedToken: {
      name: "Wrapped Matic",
      symbol: "WMATIC",
      decimals: 18,
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    },
  },
  // opBNB
  204: {
    website: "https://opbnb.bnbchain.org/",
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_opbnb.jpg",
    description:
      "opBNB is a layer-2 scaling solution built on BNB Chain, designed to reduce transaction costs and improve throughput for decentralized applications (dApps) by utilizing Optimistic Rollups technology.",
    wrappedToken: {
      name: "Wrapped BNB",
      symbol: "WBNB",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
  },
  // Fraxtal
  252: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_fraxtal.jpg",
    wrappedToken: {
      name: "Wrapped Frax Ether",
      symbol: "wfrxETH",
      decimals: 18,
      address: "0xfc00000000000000000000000000000000000006",
    },
  },
  // Hedera
  295: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_hedera.jpg",
  },
  // World Chain
  480: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_worldchain.png",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
  },
  // Redstone
  690: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_redstone.png",
    website: "https://redstone.xyz/",
    description:
      "Redstone is a Layer 2 blockchain optimized for on-chain games, autonomous worlds, and decentralized applications. It offers low transaction fees, fast performance, and integrates tools like MUD for game development.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
  },
  // Lyra Chain
  957: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_derive%20chain.jpg",
    description:
      "Derive is a decentralized trading platform offering options, perpetuals, and structured financial products on-chain. It operates using an Optimistic Rollup for fast, scalable, and programmable DeFi trading.",
  },
  // Metis
  1088: {
    logoUrl:
      "https://cdn.prod.website-files.com/6507242ad3e4e6ff563301e4/65456ca18876498fe5fd2a49_Symbol.png",
    description:
      "Metis is a Layer 2 Ethereum scaling platform designed for decentralized applications. It offers low-cost transactions, fast performance, and tools for developers, focusing on decentralization and scalability.",
  },
  // Sanko
  1996: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_sanko.jpg",
    website: "https://sanko.xyz/",
  },
  // Vanar
  2040: {},
  // Mantle
  5000: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_mantle.jpg",
    description:
      "Mantle is a Layer-2 scaling solution for Ethereum, designed to enhance transaction throughput and reduce gas fees through its modular architecture.",
    wrappedToken: {
      name: "Wrapped Mantle",
      symbol: "WMNT",
      decimals: 18,
      address: "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
    },
  },
  // Cyber
  7560: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_cyber.jpg",
    description:
      "Cyber is a Layer 2 blockchain focused on social applications, offering a smooth user experience with account abstraction, high performance via EigenDA, and decentralized infrastructure. It supports social dApps, ensuring low costs and high transaction throughput while securing the network through ETH restaking and decentralized sequencers.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
  },
  // Kinto
  7887: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_kinto.jpg",
    description:
      "Kinto is a Layer 2 blockchain solution designed for financial applications, emphasizing safety, scalability, and low transaction costs.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x0E7000967bcB5fC76A5A89082db04ed0Bf9548d8",
    },
  },
  // DOS Chain
  7979: {},
  // Kaia
  8217: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_kaia.jpg",
    description:
      "Kaia is a Layer 1 and 2 blockchain platform created through the merger of Klaytn and Finschia, designed for seamless integration into the Web3 ecosystem. It features low latency transactions, supports account abstraction and gas fee delegation, and aims to enhance user experience for over 250 million users via popular messaging apps like LINE and KakaoTalk.",
    wrappedToken: {
      name: "Wrapped Kaia",
      symbol: "WKLAY",
      decimals: 18,
      address: "0x19aac5f612f524b754ca7e7c41cbfa2e981a4432",
    },
  },
  // B3
  8333: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_b3.png",
    description:
      "B3 is a horizontally-scaled gaming ecosystem built on the Base blockchain, developed by a team of alumni from Base, Coinbase, and Ethereum. It aims to revolutionize on-chain gaming experiences, with its mainnet now live for players.",
  },
  // Base
  8453: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_base.jpg",
    description:
      "Base is a builder-friendly Ethereum Layer 2 solution designed for low-cost, secure transactions aimed at bringing the next billion users on-chain. Powered by the OP Stack and integrated with Coinbase, it enables developers to easily deploy EVM-compatible applications while ensuring fast performance and scalability.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
  },
  // Nautilus
  22222: {},
  // Apechain
  33139: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_apechain.png",
    description:
      "ApeChain is a blockchain platform designed for community-driven projects and applications, focusing on low transaction costs and high scalability. It aims to create an engaging ecosystem for decentralized finance (DeFi), gaming, and social interaction, promoting a vibrant community.",
  },
  // Mode
  34443: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_mode.jpg",
    description:
      "Mode Network is a Layer 2 blockchain focused on decentralized finance (DeFi), aiming to bring on-chain finance to billions. It partners with Optimism to provide a secure infrastructure for a range of DeFi applications, rewarding users for contributions to ecosystem growth and facilitating a new on-chain economy.",
  },
  // Aleph Zero
  41455: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_aleph-zero-evm.png",
  },
  // Donatuz
  42026: {},
  // Arbitrum One
  42161: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_arbitrum.jpg",
    description:
      "Arbitrum is a leading Layer 2 scaling solution for Ethereum, utilizing advanced rollup technology to enhance transaction speed and reduce costs. It offers various products like Arbitrum Rollup, AnyTrust, and Orbit, designed for scalable and efficient decentralized applications. The platform emphasizes security and compatibility with Ethereum, making it a robust choice for developers and users in the DeFi ecosystem.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    },
  },
  // Arbitrum Nova
  42170: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_arbitrum_nova.jpg",
    description:
      "Arbitrum Nova is a Layer 2 scaling solution that focuses on low transaction fees and high throughput, leveraging AnyTrust technology and a Data Availability Committee (DAC) to minimize costs. It's particularly suited for applications like gaming that require high transaction volumes while maintaining decent security.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x722e8bdd2ce80a4422e880164f2079488e115365",
    },
  },
  // Celo
  42220: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_celo.jpg",
    description:
      "Celo is a mobile-first blockchain platform designed to make Web3 accessible for everyone, focusing on low-cost transactions and a diverse ecosystem of decentralized applications (dApps). It aims to promote financial inclusion globally by supporting multiple currencies and facilitating easy interactions on mobile devices. Celo emphasizes a regenerative finance (ReFi) approach, fostering sustainable growth within its community.",
  },
  // Etherlink
  42793: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_etherlink.jpg",
    description:
      "Etherlink is a Layer 2 solution powered by Tezos' Smart Rollup technology, focusing on low transaction costs and fast confirmations. It enables seamless EVM compatibility, allowing easy migration of existing Ethereum projects while ensuring decentralized governance and security through a non-custodial architecture.",
    wrappedToken: {
      name: "Wrapped XTZ",
      symbol: "WXTZ",
      decimals: 18,
      address: "0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb",
    },
  },
  // Avalanche
  43114: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/agg_icons/avax.jpg",
    description:
      "Avalanche is a high-performance blockchain platform designed for decentralized applications (dApps) that prioritizes scalability, security, and speed. It features subnets for independent blockchains, enabling developers to launch applications quickly with low fees. With transaction finality under one second, Avalanche supports a vibrant ecosystem of DeFi and other applications while maintaining a commitment to sustainability, consuming minimal energy.",
    wrappedToken: {
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      decimals: 18,
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    },
  },
  // DFK
  53935: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/agg_icons/dfk.png",
    description:
      "DeFi Kingdoms is a blockchain-based play-to-earn game that combines decentralized finance (DeFi) elements with a fantasy-themed gaming experience. Players can engage in various activities like questing, farming, and trading, all while earning rewards in the game's native tokens. The platform emphasizes community governance and integrates features like NFT heroes and resources, providing a unique blend of gaming and financial opportunities.",
    wrappedToken: {
      name: "Wrapped JEWEL",
      symbol: "WJEWEL",
      decimals: 18,
      address: "0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260",
    },
  },
  // Superposition
  55244: {},
  // Linea
  59144: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_linea.jpg",
    description:
      "Linea is a secure zkEVM ecosystem designed to empower decentralized applications (dApps) with low gas fees and rapid transactions. Backed by ConsenSys, it prioritizes security through advanced cryptography and partnerships, aiming to create a safe environment for Web3 interactions. Linea supports a wide range of use cases, including DeFi, gaming, and social applications.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f",
    },
  },
  // BOB
  60808: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_bob.jpg",
    description:
      "BOB is a hybrid Layer 2 blockchain that combines Bitcoin's security with Ethereum's versatility, allowing developers to build EVM-compatible applications on Bitcoin. It focuses on providing low transaction costs and leveraging dual liquidity from both ecosystems to enhance DeFi mass adoption. BOB aims to empower developers with advanced tooling and infrastructure, making it easier to launch and grow projects.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
  },
  // Blast
  81457: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_blast.jpg",
    description:
      "Blast is a full-stack EVM blockchain that uniquely offers native yield for Ethereum and stablecoins. It focuses on providing a robust infrastructure for decentralized finance (DeFi) applications, enabling users to bridge and earn while benefiting from low fees and fast transactions. Backed by prominent investors, Blast aims to enhance the DeFi landscape by simplifying access and maximizing returns.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4300000000000000000000000000000000000004",
    },
  },
  // Scroll
  534352: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_scroll.jpg",
    description:
      "Scroll is a zkEVM Layer 2 solution for Ethereum that enhances scalability while ensuring security and compatibility. By utilizing zero-knowledge proofs, it facilitates efficient transaction processing, enabling high throughput and lower costs for decentralized applications (dApps)",
  },
  // Xai
  660279: {
    website: "https://xai.games/",
    description:
      "Xai is a Layer 3 solution built on Arbitrum, focused on enhancing scalability for AAA gaming applications. It provides developers with tools to create engaging games and offers users access to in-game economies. Xai promotes community engagement through initiatives like the Vanguard League.",
    wrappedToken: {
      name: "Wrapped Xai",
      symbol: "WXAI",
      decimals: 18,
      address: "0x3fB787101DC6Be47cfe18aeEe15404dcC842e6AF",
    },
  },
  // Treasure Ruby
  978657: {},
  // Zora
  7777777: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_zora.jpg",
    description:
      "Zora is a decentralized marketplace for NFTs and digital assets, enabling creators to mint, sell, and discover unique content. It focuses on community-driven features, reshaping the trading and valuation of digital art.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
  },
  // Degen
  666666666: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_degen.jpg",
    wrappedToken: {
      name: "Wrapped Degen",
      symbol: "WDEGEN",
      decimals: 18,
      address: "0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387",
    },
  },
  // Ancient8
  888888888: {
    logoUrl:
      "https://raw.githubusercontent.com/DefiLlama/icons/refs/heads/v2/assets/chains/rsz_ancient8.jpg",
    description:
      "Ancient8 is a Web3 gaming platform that empowers players and builds community through blockchain integration. It offers tools for earning rewards and enhancing the gaming experience while connecting users within the gaming ecosystem.",
    wrappedToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
  },
  // Lumia
  994873017: {},
};

export const citrusChainsMap = new Map(
  Object.entries(chains).map((x) => [Number(x[0]), x[1]]),
);

export const citrusChains = citrusChainsMap.values();
