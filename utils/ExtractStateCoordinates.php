<?php

class ExtractStateCoordinates
{
    /**
     * Holds the xml file.
     *
     * @var \SimpleXMLElement
     */
    protected $xml;

    /**
     * Result data.
     *
     * @var array
     */
    protected $data = [];

    /**
     * ExtractStateCoordinates constructor.
     *
     * @param string $states
     */
    public function __construct($states = 'states.xml')
    {
        $this->xml = simplexml_load_file(__DIR__.'/'.$states);

        $this->compute();
    }

    /**
     * Print the data in json.
     */
    public function json()
    {
        echo json_encode($this->data);
    }

    /**
     * Compute the coordinates.
     */
    protected function compute()
    {
        foreach ($this->xml->children() as $state) {
            $name = (string)$state['name'];
            $this->data[$name] = $this->findBounds($state);
        }
    }

    /**
     * Find bounds of state.
     *
     * @param \SimpleXMLElement $state
     * @return array
     */
    protected function findBounds(SimpleXMLElement $state)
    {
        $southWest = [
            'lat' => 180,
            'lng' => 180,
        ];

        $northEast = [
            'lat' => -180,
            'lng' => -180,
        ];

        foreach ($state->children() as $point) {
            $lat = floatval($point['lat']);
            $lng = floatval($point['lng']);
            $southWest['lat'] = min($southWest['lat'], $lat);
            $southWest['lng'] = min($southWest['lng'], $lng);

            $northEast['lat'] = max($northEast['lat'], $lat);
            $northEast['lng'] = max($northEast['lng'], $lng);
        }

        return [
            'southWest' => $southWest,
            'northEast' => $northEast,
        ];
    }
}

// Initialize and print the data.
(new ExtractStateCoordinates())->json();
