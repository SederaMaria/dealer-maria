import React, { useState, useEffect } from 'react';
import { logger, network } from '../../../../utils';

import { Spin } from 'antd';
import { Calculator } from '.';

function CalculatorRenderer(props: any) {
  const leaseApplicationId: string = `${props.match.params.leaseApplicationId}`

  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  const getApplicationDetails = async () => {
    if (!loading) { setLoading(true) }

    try {
      let data = await network.GET(`/api/v1/dealers/get-details?id=${leaseApplicationId}`)
      setData(data.data.data.leaseApplication)
      setLoading(false)
    } catch (e) {
      logger.error("Error fetching Applicatins", e);
      setLoading(false)
    }
  }

  useEffect(() => {
    getApplicationDetails();
  }, [])

  return data ? (
    <Spin
      spinning={loading}
      size='large'
      tip='Loading...'
    >
      <Calculator data={data} />
    </Spin>
  ) : null;
}

export default CalculatorRenderer
