import * as React from 'react';
import { Link } from 'react-router-dom';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Card from 'grommet/components/Card';
import Tile from 'grommet/components/Tile';
import Tiles from 'grommet/components/Tiles';
import { sets } from './data/sets';

export interface ISetData {
    thumbnail: string;
    label: string;
    heading: string;
    description: string;
}

class SetSelectionPage extends React.Component {
    public render(): React.ReactNode {
        return (
            <Box>
                <Tiles>
                    {sets.map(set => (
                        <Tile key={set.id}>
                            <Card
                                thumbnail={
                                    <Box align="center">
                                        <img src={set.image} height={100} width={100} />
                                    </Box>
                                }
                                heading={set.name}
                                description={set.description}
                                link={<Link to={`issue/${set.id}`}>Issue this Set</Link>}
                            />
                        </Tile>
                    ))}
                </Tiles>
            </Box>
        );
    }
}

export default SetSelectionPage;
