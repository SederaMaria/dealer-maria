import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Helmet } from 'react-helmet';
import { AutoComplete } from 'antd';

interface Props {
  // Callback before `placeService.getDetails` API request
  beforePlacesGetDetails?: any,
  // Callback equivalent to [getDetails callback](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesService.getDetails)
  onPlacesGetDetailsResult?: any,
  // If for some reason window.google is not defined
  loadScriptErrorMsg?: string,
}

interface AutoCompleteOption {
  value: string,
  label?: string,
  data: object,
}

// This component uses antd's AutoComplete as base component
// To enable or customize more capabilities, best check out https://ant.design/components/auto-complete/#API
// TODO(S):
// - Move/copy file to higher heriarchy so it can be reused
// - Implement `sessionToken`
// - Leverage `autocompleteService.setFields`
export const AutoCompleteAddress = ({ beforePlacesGetDetails, onPlacesGetDetailsResult, loadScriptErrorMsg }: Props) => {
  // Placeholders for service instances
  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
  let autocompleteService: any;
  // https://developers.google.com/maps/documentation/javascript/reference/places-service
  let placeService: any;

  const [searchOptions, setSearchOptions] = useState<AutoCompleteOption[]>([]);

  const debouncedHandleOnSearch = useDebouncedCallback(
    (value) => {
      handleOnSearch(value);
    },
    // delay in ms
    850
  );

  // @value: User input string
  const handleOnSearch = (value: string) => {
    if (!autocompleteService && window.google) {
      autocompleteService = new window.google.maps.places.AutocompleteService()
    } else {
      // TODO: Inform error, suggest refresh or contact admin
      // if (loadScriptErrorMsg) { message.error(loadScriptErrorMsg) }
      return
    }

    if (!value) {
      setSearchOptions([])
    } else {
      autocompleteService.getPlacePredictions({
        input: value,
        componentRestrictions: {
          country: ['us'],
        },
        types: ['address'],
      }, (data: any, status: any) => {
        if (!data || (status !== "OK")) {
          setSearchOptions([])
        } else {
          setSearchOptions(data.map((datum: any) => {
            return {
              value: datum.description || 'error',
              data: datum,
            }
          }))
        }
      })
    }
  }

  // @value: AutoCompleteOption.value
  // @option: AutoCompleteOption object
  const handleOnSelect = (value: any, option: any) => {
    if (!placeService && window.google) {
      placeService = new window.google.maps.places.PlacesService(document.createElement('div'))
    } else {
      // TODO: Inform error, suggest refresh or contact admin
      // if (loadScriptErrorMsg) { message.error(loadScriptErrorMsg) }
      return
    }

    if (typeof beforePlacesGetDetails === 'function') {
      beforePlacesGetDetails(value, option)
    }

    placeService.getDetails({ placeId: option.data.place_id, fields: ['address_components'] }, (placeResult: any, placeServiceStatus: any) => {
      if (typeof onPlacesGetDetailsResult === 'function') {
        onPlacesGetDetailsResult(placeResult, placeServiceStatus)
      }
    })
  };


  return (
    <>
      <Helmet>
        <script async src={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`}></script>
      </Helmet>
      <AutoComplete
        options={searchOptions}
        onSearch={(value) => debouncedHandleOnSearch(value)}
        onSelect={handleOnSelect}
        className="space-up"
      />
    </>
  )
}

export default AutoCompleteAddress