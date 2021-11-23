import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  Button,
  TextField,
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import Lightbox from 'react-awesome-lightbox'
import 'react-awesome-lightbox/build/style.css'

import ModalVideo from 'react-modal-video'
import 'react-modal-video/css/modal-video.min.css'

import abi from 'abis/nft'
import marketABI from 'abis/market'
import { MARKET_ADDRESS, NFT_ADDRESS } from 'constants/app'
import useStyles from 'config/styles'
import NFTVideo from 'components/NFTVideo'
import { useActiveWeb3React } from 'hooks/web3'
import { useSellTokenIds, useSellOfferIds, getOfferById } from 'hooks/useOffer'
import { formatId } from 'utils'

const useCustomStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
    padding: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  content: {
    flex: '1 0 auto',
    padding: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      minHeight: '300px',
    },
  },
  coverWrapper: {
    width: '40%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}))

export const Trait = ({ nft, darkTheme, seller }) => {
  const {
    id,
    name,
    seed,
    white_image,
    black_image,
    white_single_video,
    black_single_video,
    white_triple_video,
    black_triple_video,
    owner,
  } = nft

  const [open, setOpen] = useState(false)
  const [imageOpen, setImageOpen] = useState(false)
  const [videoPath, setVideoPath] = useState(null)
  const [sellPrice, setSellPrice] = useState(null)
  const [theme, setTheme] = useState(darkTheme ? 'black' : 'white')
  const [price, setPrice] = useState('')
  const [tokenName, setTokenName] = useState(name)
  const [address, setAddress] = useState('')
  const [accountTokenIds, setAccountTokenIds] = useState([])

  const classes = useStyles()
  const customClasses = useCustomStyles()
  const { account, library } = useActiveWeb3React()
  const history = useHistory()
  const location = useLocation()

  const sellOfferIds = useSellOfferIds(id)
  const sellTokenIds = useSellTokenIds(account)

  const handlePlay = (videoPath) => {
    console.log(videoPath)
    fetch(videoPath).then((res) => {
      if (res.ok) {
        setVideoPath(videoPath)
        setOpen(true)
      } else {
        alert('Video is being generated, come back later')
      }
    })
  }

  const handleMakeSell = async () => {
    const signer = library.getSigner()
    const contract = new ethers.Contract(NFT_ADDRESS, abi, signer)
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer)

    try {
      const approvedAll = await contract.isApprovedForAll(
        account,
        MARKET_ADDRESS,
      )
      if (!approvedAll) {
        await contract
          .setApprovalForAll(MARKET_ADDRESS, true)
          .then((tx) => tx.wait())
      }
      await market
        .makeSellOffer(NFT_ADDRESS, id, ethers.utils.parseEther(price))
        .then((tx) => tx.wait())
      window.location.reload()
    } catch (err) {
      alert(err.data ? err.data.message : err.message)
    }
  }

  const handleMakeBuy = async () => {
    const signer = library.getSigner()
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer)

    try {
      await market
        .makeBuyOffer(NFT_ADDRESS, id, {
          value: ethers.utils.parseEther(price),
        })
        .then((tx) => tx.wait())
      window.location.reload()
    } catch (err) {
      alert(err.data ? err.data.message : err.message)
    }
  }

  const handleCancelSell = async () => {
    const signer = library.getSigner()
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer)
    try {
      await market.cancelSellOffer(sellOfferIds[0]).then((tx) => tx.wait())
      window.location.reload()
    } catch (err) {
      alert(err.data ? err.data.message : err.message)
    }
  }

  const handleAcceptSell = async () => {
    const signer = library.getSigner()
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer)

    try {
      const offerId = sellOfferIds[0]
      const offer = await market.offers(offerId)
      console.log(offer)
      await market
        .acceptSellOffer(offerId, {
          value: ethers.BigNumber.from(offer.price),
        })
        .then((tx) => tx.wait())
      history.push('/my-nfts')
    } catch (err) {
      alert(err.data ? err.data.message : err.message)
    }
  }

  const handleTransfer = async () => {
    const signer = library.getSigner()
    const contract = new ethers.Contract(NFT_ADDRESS, abi, signer)

    try {
      await contract.transferFrom(account, address, id).then((tx) => tx.wait())
      history.push('/my-nfts')
    } catch (err) {
      console.log(err)
    }
  }

  const handleSetTokenName = async () => {
    const signer = library.getSigner()
    const contract = new ethers.Contract(NFT_ADDRESS, abi, signer)

    try {
      await contract.setTokenName(id, tokenName).then((tx) => tx.wait())
      history.push('/my-nfts')
    } catch (err) {
      alert(err.data ? err.data.message : err.message)
    }
  }

  const handlePrev = () => history.push(`/detail/${Math.max(id - 1, 0)}`)

  const handleNext = async () => {
    const contract = new ethers.Contract(NFT_ADDRESS, abi, library)
    const totalSupply = await contract.totalSupply()
    history.push(`/detail/${Math.min(id + 1, totalSupply.toNumber() - 1)}`)
  }

  const handlePrevInWallet = () => {
    const index = accountTokenIds.indexOf(id)
    history.push(`/detail/${accountTokenIds[Math.max(index - 1, 0)]}`)
  }

  const handleNextInWallet = async () => {
    const index = accountTokenIds.indexOf(id)
    history.push(
      `/detail/${
        accountTokenIds[Math.min(index + 1, accountTokenIds.length - 1)]
      }`,
    )
  }

  useEffect(() => {
    setTheme(darkTheme ? 'black' : 'white')
  }, [darkTheme])

  useEffect(() => {
    const { hash } = location
    if (hash === '#black_image' || hash === '#white_image') {
      setTheme(hash.includes('black') ? 'black' : 'white')
      setImageOpen(true)
    } else if (
      hash === '#black_single_video' ||
      hash === '#white_single_video'
    ) {
      setTheme(hash.includes('black') ? 'black' : 'white')
      handlePlay(
        hash.includes('black') ? black_single_video : white_single_video,
      )
    } else if (
      hash === '#black_triple_video' ||
      hash === '#white_triple_video'
    ) {
      setTheme(hash.includes('black') ? 'black' : 'white')
      handlePlay(
        hash.includes('black') ? black_triple_video : white_triple_video,
      )
    }
  }, [
    location,
    black_single_video,
    white_single_video,
    black_triple_video,
    white_triple_video,
  ])

  useEffect(() => {
    const getSellOffer = async (id) => {
      const offer = await getOfferById(library, id)
      setSellPrice(offer.price)
    }
    if (sellOfferIds.length > 0) {
      getSellOffer(sellOfferIds[0])
    }

    return () => setSellPrice(null)
  }, [library, sellOfferIds])

  useEffect(() => {
    const getAccountTokenIds = async () => {
      const contract = new ethers.Contract(NFT_ADDRESS, abi, library)
      const tokenIds = await contract.walletOfOwner(account)
      setAccountTokenIds(tokenIds.map((tokenId) => tokenId.toNumber()))
    }
    if (account) {
      getAccountTokenIds()
    }
  }, [account, library])

  return (
    <Container className={classes.section1}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card className={customClasses.root}>
            <CardActionArea onClick={() => setImageOpen(true)}>
              <CardMedia
                className={classes.nftImage}
                image={theme === 'black' ? black_image : white_image}
              />
              <div className={classes.nftInfo}>
                <Typography
                  className={classes.nftId}
                  variant="body1"
                  gutterBottom
                  style={{
                    color: theme === 'black' ? '#FFFFFF' : '#000000',
                  }}
                >
                  {formatId(id)}
                </Typography>
                {sellPrice && (
                  <Typography className={classes.nftPrice} variant="body1">
                    {sellPrice.toFixed(4)}Ξ
                  </Typography>
                )}
              </div>
            </CardActionArea>
          </Card>
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CopyToClipboard text={window.location.href}>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ width: '100%' }}
                  >
                    Copy link
                  </Button>
                </CopyToClipboard>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ width: '100%' }}
                  onClick={handlePrev}
                >
                  Prev
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ width: '100%' }}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </Box>
          {account === (seller || owner) && accountTokenIds.length > 0 && (
            <Box mt={1}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ width: '100%' }}
                    onClick={handlePrevInWallet}
                  >
                    Prev In Wallet
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ width: '100%' }}
                    onClick={handleNextInWallet}
                  >
                    Next In Wallet
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
          {imageOpen && (
            <Lightbox
              image={theme === 'black' ? black_image : white_image}
              onClose={() => setImageOpen(false)}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <NFTVideo
            image_thumb={theme === 'black' ? black_image : white_image}
            onClick={() =>
              handlePlay(
                theme === 'black' ? black_single_video : white_single_video,
              )
            }
          />
          <Box mt={2}>
            <Typography variant="body1" align="center">
              Single Video
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box mt={3}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <NFTVideo
              image_thumb={theme === 'black' ? black_image : white_image}
              onClick={() =>
                handlePlay(
                  theme === 'black' ? black_triple_video : white_triple_video,
                )
              }
            />
            <Box mt={2}>
              <Typography variant="body1" align="center">
                Triple Video
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            <Box mb={3}>
              <Typography align="left" variant="body1" color="secondary">
                Owner
              </Typography>
              <Typography align="left" variant="body2" color="textPrimary">
                <Link
                  style={{ color: '#fff' }}
                  to={`/gallery?address=${seller || owner}`}
                >
                  {seller || owner}
                </Link>
              </Typography>
            </Box>
            <Box mb={3}>
              <Typography align="left" variant="body1" color="secondary">
                Seed
              </Typography>
              <Typography align="left" variant="body2" color="textPrimary">
                {seed}
              </Typography>
            </Box>
            {name && (
              <Box mb={3}>
                <Typography align="left" variant="body1" color="secondary">
                  Name
                </Typography>
                <Typography align="left" variant="body2" color="textPrimary">
                  {name}
                </Typography>
              </Box>
            )}
            <Box>
              {account === nft.owner ? (
                <>
                  <Box mb={3}>
                    <Typography gutterBottom variant="h6" align="left">
                      TRANSFER
                    </Typography>
                    <Box display="flex">
                      <TextField
                        variant="filled"
                        color="secondary"
                        placeholder="Enter address here"
                        fullWidth
                        size="small"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleTransfer}
                      >
                        Send
                      </Button>
                    </Box>
                  </Box>
                  <Box mb={3}>
                    <Typography gutterBottom variant="h6" align="left">
                      PUT ON SALE
                    </Typography>
                    <Box display="flex">
                      <TextField
                        type="number"
                        variant="filled"
                        color="secondary"
                        placeholder="Enter ETH price here"
                        value={price}
                        size="small"
                        style={{ flex: 1 }}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleMakeSell}
                      >
                        Sell
                      </Button>
                    </Box>
                  </Box>
                  <Box mb={3}>
                    <Typography gutterBottom variant="h6" align="left">
                      RENAME
                    </Typography>
                    <Box display="flex">
                      <TextField
                        variant="filled"
                        color="secondary"
                        placeholder="Enter token name here"
                        value={tokenName}
                        size="small"
                        fullWidth
                        onChange={(e) => setTokenName(e.target.value)}
                      />
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleSetTokenName}
                      >
                        Update
                      </Button>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  {!sellTokenIds.includes(id) && (
                    <Box mb={3}>
                      <Typography gutterBottom variant="h6" align="left">
                        BID
                      </Typography>
                      <Box display="flex">
                        <TextField
                          type="number"
                          variant="filled"
                          color="secondary"
                          placeholder="Enter ETH price here"
                          value={price}
                          size="small"
                          style={{ flex: 1 }}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={handleMakeBuy}
                        >
                          Make Offer
                        </Button>
                      </Box>
                    </Box>
                  )}
                  {sellTokenIds.includes(id) ? (
                    <Box mb={3}>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleCancelSell}
                        size="large"
                        style={{ height: '100%' }}
                      >
                        Cancel Sell Offer
                      </Button>
                    </Box>
                  ) : (
                    nft.owner.toLowerCase() ===
                      MARKET_ADDRESS.toLowerCase() && (
                      <Box mb={3}>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={handleAcceptSell}
                          size="large"
                          style={{ height: '100%' }}
                        >
                          Buy Now for {sellPrice && sellPrice.toFixed(4)}Ξ
                        </Button>
                      </Box>
                    )
                  )}
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <ModalVideo
        channel="custom"
        url={videoPath}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </Container>
  )
}
