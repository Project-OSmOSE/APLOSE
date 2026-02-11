import React, { useMemo, useRef } from 'react';
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts';
import { intToRGB } from '../DeploymentsMap/utils.functions';
import { LightDeployment } from '../../api';
import { ChannelConfigurationStatusEnum } from '../../api/types.gql-generated';

type CampaignSerie = {
    campaign: LightDeployment['campaign'] | null
    state: 'active' | 'recovered'
}

export const DeploymentsTimeline: React.FC<{
    deployments: Array<LightDeployment>;
    setSelectedDeploymentID: (id: string | undefined) => void;
}> = ({ deployments, setSelectedDeploymentID }) => {

    const height: number = useMemo(() => 130 + [ ...new Set(deployments.map(d => d.site?.id)) ].length * 50, [ deployments ])
    const chart = useRef<ReactApexChart | null>(null);

    const campaignSeries = useMemo<CampaignSerie[]>(() => {
        const campaigns = new Array<CampaignSerie>();
        for (const deployment of deployments) {
            if (!deployment.recoveryDate && !deployment.channelConfigurations.edges.some(e => e?.node?.status === ChannelConfigurationStatusEnum.Active)) {
                continue
            }

            const serie: CampaignSerie = {
                campaign: deployment.campaign ?? null,
                state: deployment.recoveryDate ? 'recovered' : 'active',
            }
            if (campaigns.some(s => s.campaign?.id === serie.campaign?.id && s.state === serie.state)) continue
            campaigns.push(serie)
        }
        return campaigns
    }, [ deployments ]);

    const series: ApexAxisChartSeries = useMemo(() => {
        const series = campaignSeries.map(s => ({
            name: `${ s?.campaign?.name ?? 'No campaign' }${ s.state === 'recovered' ? '' : ' (ongoing)' }`,
            data: deployments.filter(d => {
                // Only current campaign
                if (d.campaign?.id !== s?.campaign?.id) return false;
                // Only deployments which has been deployed
                if (!d.deploymentDate) return false;

                if (s.state === 'recovered' && !!d.recoveryDate) return true;
                return s.state === 'active' && !d.recoveryDate && d.channelConfigurations.edges.some(e => e?.node?.status === ChannelConfigurationStatusEnum.Active)
            }).map(d => ({
                x: d.site?.name ?? 'No site',
                y: [
                    new Date(d.deploymentDate!).getTime(),
                    new Date(d.recoveryDate ?? Date.now()).getTime(),
                ],
                meta: d,
                fill: s.state === 'recovered' ? undefined : {
                    type: 'pattern',
                    pattern: {
                        style: 'verticalLines',
                        width: 4,
                        height: 4,
                        strokeWidth: 2,
                    },
                },
            })),
        }))
        return series
    }, [ campaignSeries, deployments ])
    const options: ApexOptions = useMemo(() => ({
        chart: {
            type: 'rangeBar',
            height,
            zoom: {
                enabled: false,
            },
            toolbar: {
                export: {
                    png: {
                        filename: [ ...new Set(deployments.map(d => d.project.name)) ].join(' - ') + '__Timeline',
                    },
                },
            },
            events: {
                click(e: any, chart?: any, opts?: any) {
                    if (opts.seriesIndex < 0 && opts.dataPointIndex < 0) {
                        setSelectedDeploymentID(undefined)
                    } else {
                        const data = opts.config.series[opts.seriesIndex].data;
                        const deployment: LightDeployment = data[opts.dataPointIndex].meta;
                        setSelectedDeploymentID(deployment.id)
                    }
                },
            },
        },
        colors: [ ...new Set(deployments.map(d => +(d.campaign?.id ?? d.id))) ].map(intToRGB),
        plotOptions: {
            bar: {
                borderRadius: 2,
                horizontal: true,
                rangeBarGroupRows: true,
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: campaignSeries.map(s => s.state === 'recovered' ? '#fff' : '#444'),
            },
            formatter(val: string | number | number[], opts?: any): string | number {
                const data = opts.w.config.series[opts.seriesIndex].data;
                const deployment: LightDeployment = data[opts.dataPointIndex].meta;
                return `${ deployment?.name ?? 'Deployment ' + deployment.id }${deployment.recoveryDate ? '' : ' (ongoing)'}`
            },
        },
        xaxis: {
            type: 'datetime',
        },
        legend: {
            position: 'bottom',
        },
    }), [ deployments, height, campaignSeries ])

    return (
        <ReactApexChart ref={ chart }
                        options={ options }
                        series={ series }
                        type="rangeBar"
                        height={ height }
                        style={ { width: '100%' } }
                        width="100%"/>

    )
}