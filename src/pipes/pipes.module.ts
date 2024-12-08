import { NgModule } from '@angular/core';
import { SortingPipe } from './sorting/sorting';
import { MsgfilterPipe } from './msgfilter/msgfilter';
import { FilterPipe } from './filter/filter';

@NgModule({
	declarations: [SortingPipe,
    MsgfilterPipe,
    FilterPipe],
	imports: [],
	exports: [SortingPipe,
    MsgfilterPipe,
    FilterPipe]
})
export class PipesModule {}
