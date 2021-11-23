import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import { Container, Typography } from '@material-ui/core'
import { ethers } from 'ethers'

import abi from 'abis/nft'
import { NFT_ADDRESS } from 'constants/app'
import useStyles from 'config/styles'
import { useActiveWeb3React } from 'hooks/web3'
import PaginationGrid from 'components/PaginationGrid'

const Gallery = () => {
  const classes = useStyles()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [collection, setCollection] = useState([])
  const [address, setAddress] = useState(null)

  const { library } = useActiveWeb3React()

  useEffect(() => {
    let isSubscribed = true
    const searchParams = new URLSearchParams(location.search)
    const address = searchParams.get('address')

    const getTokens = async () => {
      try {
        setLoading(true)
        const contract = new ethers.Contract(NFT_ADDRESS, abi, library)
        let tokenIds = []
        if (address) {
          const tokens = await contract.walletOfOwner(address)
          tokenIds = tokens.map((t) => t.toNumber())
        } else {
          setAddress(address)
          const balance = await contract.totalSupply()
          tokenIds = [...Array(balance.toNumber()).keys()]
          tokenIds = tokenIds.reverse()
        }
        if (isSubscribed) {
          setCollection(tokenIds)
          setLoading(false)
        }
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }

    getTokens()

    return () => (isSubscribed = false)
  }, [library, location])

  return (
    <Container className={classes.root}>
      <Typography variant="h4" className={classes.sectionTitle} gutterBottom>
        <Typography variant="h4" component="span">
          RANDOM
        </Typography>
        &nbsp;
        <Typography variant="h4" component="span" color="primary">
          WALK
        </Typography>
        &nbsp;
        <Typography variant="h4" component="span">
          NFT
        </Typography>
        &nbsp;
        <Typography variant="h4" component="span" color="secondary">
          GALLERY
        </Typography>
      </Typography>
      {address && (
        <Typography variant="body2" className={classes.sectionTitle}>
          Owned by {address}
        </Typography>
      )}
      <PaginationGrid loading={loading} data={collection} />
    </Container>
  )
}

export default Gallery
