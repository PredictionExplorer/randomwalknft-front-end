import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@material-ui/core'

import nftService from 'services/nft'
import { formatId } from 'utils'

const Random = (props) => {
  const [tokenId, setTokenId] = useState(null)
  const [blackImage, setBlackImage] = useState(null)

  useEffect(() => {
    const getToken = async () => {
      const tokenIds = await nftService.random()
      const fileName = tokenIds[0].toString().padStart(6, '0')
      setTokenId(tokenIds[0])
      setBlackImage(
        `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_black.png`,
      )
    }
    getToken()
  }, [])

  return (
    <div
      style={{
        backgroundImage: `url(${blackImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        height: '100vh',
      }}
    >
      {tokenId && (
        <Typography
          variant="h6"
          style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Link style={{ color: '#fff' }} to={`/detail/${tokenId}`}>
            {formatId(tokenId)}
          </Link>
        </Typography>
      )}
    </div>
  )
}

export default Random
