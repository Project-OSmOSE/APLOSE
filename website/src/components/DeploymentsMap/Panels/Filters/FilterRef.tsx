import { LightDeployment } from "../../../../api";

export interface FilterRef {
  /**
   * Check if the deployment can be visible or not, depending on the filter configuration
   * @param deployment {LightDeployment} the deployment to check
   */
  filterDeployment: (deployment: LightDeployment) => boolean;

  /**
   * Reset filter to default values
   */
  reset: () => void;

  /**
   * Filtering state
   */
  isFiltering: boolean;
}