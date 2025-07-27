// api 문서를 바탕으로 응답값 interface를 정의하고 활용합니다.
// url + restful action + Response/Request 형태로 네이밍 했습니다. (index, show, update, destroy)

export interface SearchIndexResponse {
  id: number;
  title: string;
  thumbnailUrl: string;
  category: string;
  address: string;
  date: string;
  view: number;
}

export interface SearchResultIndexResponse {
  id: number;
  title: string;
  category: string;
  address: string;
  thumbnailUrl: string;
}

export interface SearchRecentIndexResponse {
  result: string[];
}
